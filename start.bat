@echo off
echo ========================================
echo   Crypto Dashboard - Starting Servers
echo ========================================
echo.

REM Start backend server in a new window
echo [1/2] Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d C:\claude-code\Bitsbit\backend && npm start"

REM Wait a bit for backend to initialize
timeout /t 3 /nobreak > nul

REM Start frontend server in a new window
echo [2/2] Starting Frontend Server (Port 3000)...
start "Frontend Server" cmd /k "cd /d C:\claude-code\Bitsbit\frontend && set PORT=3000 && npm start"

echo.
echo ========================================
echo   Servers are starting...
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
