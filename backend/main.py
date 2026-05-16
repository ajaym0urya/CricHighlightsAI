import os
import io
import json
import re
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CricHighlights AI (Stable)")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if GROQ_API_KEY:
    print("✅ Groq Client Initialized. Llama 3 is LIVE.")
    client = Groq(api_key=GROQ_API_KEY)
else:
    print("❌ ERROR: GROQ_API_KEY is missing in .env")
    client = None

@app.get("/api/health")
async def root():
    return {"message": "CricHighlights AI (Groq Engine) is running"}

@app.post("/analyze-file")
async def analyze_file(file: UploadFile = File(...)):
    if not client:
        raise HTTPException(status_code=500, detail="Groq API Key missing in .env file.")
    
    try:
        content = await file.read()
        text_content = content.decode('utf-8', errors='ignore')
        
        if not text_content or len(text_content.strip()) < 5:
            raise HTTPException(status_code=400, detail="The uploaded file is empty.")

        print("🚀 Sending to Groq (Llama 3)...")
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert cricket highlights generator. You MUST return ONLY a valid JSON object. No other text."},
                {"role": "user", "content": f"""
                    Summarize this cricket match commentary into highlights.
                    Text: {text_content[:25000]}
                    
                    Return ONLY this JSON structure:
                    {{
                        "title": "Match Title",
                        "summary": "Match overview",
                        "highlights": [
                            {{
                                "category": "WICKET | SIX | FOUR | TURNING POINT | RESULT",
                                "time": "Over/Ball",
                                "description": "Exciting description"
                            }}
                        ],
                        "match_vibe": "One word vibe",
                        "player_of_match": "Name"
                    }}
                """}
            ],
            response_format={"type": "json_object"}
        )
        
        analysis = json.loads(completion.choices[0].message.content)
        return analysis
        
    except Exception as e:
        print(f"🔥 Groq Error: {e}")
        if "429" in str(e):
            raise HTTPException(status_code=429, detail="Groq Quota Exceeded. Please wait.")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Serve Static Files (Frontend)
static_path = os.getenv("STATIC_FILES_PATH", "static")
if os.path.exists(static_path):
    # Mount assets folder
    if os.path.exists(os.path.join(static_path, "assets")):
        app.mount("/assets", StaticFiles(directory=os.path.join(static_path, "assets")), name="assets")

    # Catch-all for SPA
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Allow API routes to be handled by FastAPI
        if full_path.startswith("analyze-file") or full_path.startswith("api"):
            return None # This allows the normal route to catch it
        
        file_path = os.path.join(static_path, "index.html")
        return FileResponse(file_path)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
