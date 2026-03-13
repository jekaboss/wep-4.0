@echo off
REM Register custom WEP protocol handler
echo Registering WEP protocol handler...

set SCRIPT_DIR=%~dp0
set PROTOCOL_KEY="HKCU\SOFTWARE\Classes\wep"
set COMMAND_KEY="HKCU\SOFTWARE\Classes\wep\shell\open\command"

REM Create registry entries
reg add %PROTOCOL_KEY% /ve /t REG_SZ /d "URL:WEP Protocol" /f
reg add %PROTOCOL_KEY% /v "URL Protocol" /t REG_SZ /d "" /f
reg add %PROTOCOL_KEY%\shell /f
reg add %PROTOCOL_KEY%\shell\open /f

REM Create launcher script
echo Creating launcher script...
(
echo @echo off
echo cd /d "%SCRIPT_DIR%"
echo start "" "start-server.bat"
echo timeout /t 2 /nobreak ^>nul
echo start "" "index.html"
) > "%SCRIPT_DIR%wep-launcher.bat"

REM Register command
reg add %COMMAND_KEY% /ve /t REG_SZ /d "cmd /c \"\"%SCRIPT_DIR%wep-launcher.bat\"\"" /f

echo.
echo ========================================
echo WEP Protocol registered successfully!
echo ========================================
echo.
echo You can now use wep:// links in your browser.
echo.
echo To test, open browser and navigate to:
echo wep://start
echo.
pause
