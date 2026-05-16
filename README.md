# 🏏 CricHighlights AI

An agentic AI-powered cricket highlights generator built for the **Build With AI: Agentic Premier League** hackathon.

## 🚀 Features
- **Real-time Extraction**: Scrapes live ball-by-ball commentary from Cricbuzz URLs.
- **AI-Driven Summaries**: Uses **Google Gemini 2.0 Flash** to identify key moments and generate exciting match highlights.
- **Premium UI**: Modern React frontend with glassmorphism, animations, and a dark/vibrant theme.
- **Mobile Responsive**: Works beautifully on all screen sizes.

## 🛠️ Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: FastAPI (Python), BeautifulSoup4, Requests.
- **AI**: Google Generative AI (Gemini).

## 🚦 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js & npm

### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt
# Create a .env file and add your API key
echo "GEMINI_API_KEY=your_google_ai_key" > .env
python main.py
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. How to Use
1. Open the web app at `http://localhost:5173`.
2. Find a match on [Cricbuzz](https://www.cricbuzz.com/).
3. Copy the URL (any tab like Scorecard or Commentary will work).
4. Paste it into the app and hit **Generate**.
5. RELIVE THE MOMENTS!

> **Note**: If you don't have an API key, you can still test the UI by typing `mock` into the URL input!

## 🏆 Hackathon Details
- **Project**: Cricket Highlights Generator
- **Theme**: Agentic Premier League
- **Build Status**: Production-Ready Demo
