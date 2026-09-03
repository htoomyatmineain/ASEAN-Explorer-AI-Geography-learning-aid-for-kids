@echo off
rem ============================================================
rem start.bat — launches the Person 4 sector Prolog server
rem (Windows equivalent of the team's start.sh)
rem
rem Requires SWI-Prolog. Tries "swipl" from PATH first, then the
rem default Windows install location.
rem ============================================================
cd /d "%~dp0"

where swipl >nul 2>nul
if %errorlevel%==0 (
    swipl -f server.pl -g start_server
) else (
    if exist "C:\Program Files\swipl\bin\swipl.exe" (
        "C:\Program Files\swipl\bin\swipl.exe" -f server.pl -g start_server
    ) else (
        echo SWI-Prolog not found. Install it from https://www.swi-prolog.org/download/stable
        echo or add swipl.exe to your PATH, then run this file again.
        pause
    )
)
