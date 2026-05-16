$PSScriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

# Start Backend
Write-Host "📡 Starting Backend..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --port 8000" -WorkingDirectory "$PSScriptRoot"

# Start Frontend
Write-Host "🎨 Starting Frontend..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev" -WorkingDirectory "$PSScriptRoot"

Write-Host "🚀 CricHighlights AI is launching..." -ForegroundColor Yellow
Write-Host "Backend: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Note: Check the backend window to confirm 'Gemini API Key found'"
