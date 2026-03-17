@echo off
setlocal
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\sync-cities.ps1"
if errorlevel 1 (
  echo.
  echo Sync failed.
  exit /b 1
)
echo.
echo Cities synced successfully.
endlocal
