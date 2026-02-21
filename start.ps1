Write-Host "========================================"
Write-Host "  Crypto Dashboard - Starting Servers"
Write-Host "========================================"
Write-Host ""

# Start backend server in a new PowerShell window
Write-Host "[1/2] Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\claude-code\Bitsbit\backend; npm start"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 3

# Start frontend server in a new PowerShell window
Write-Host "[2/2] Starting Frontend Server (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PORT='3000'; cd C:\claude-code\Bitsbit\frontend; npm start"

Write-Host ""
Write-Host "========================================"
Write-Host "  Servers are starting..."
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
