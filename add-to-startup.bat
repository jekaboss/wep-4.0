@echo off
REM ========================================
REM WEP-3.0 - Add to Windows Startup
REM ========================================

set SCRIPT_DIR=%~dp0
set LAUNCHER=%SCRIPT_DIR%launcher.hta
set STARTUP_PATH="%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\WEP-3.0.vbs"

echo ========================================
echo WEP-3.0 - Автозавантаження
echo ========================================
echo.
echo Створення ярлика для автозапуску...
echo.

REM Create VBS script for silent startup
echo Set WshShell = CreateObject("WScript.Shell") > "%TEMP%\wep-startup.vbs"
echo WshShell.Run "mshta ""%LAUNCHER%""", 1, false >> "%TEMP%\wep-startup.vbs"

copy /Y "%TEMP%\wep-startup.vbs" %STARTUP_PATH%

echo.
echo ========================================
echo ГОТОВО! WEP-3.0 додано до автозавантаження
echo ========================================
echo.
echo Сервер буде запускатися автоматично при старті Windows.
echo.
echo Щоб видалити з автозавантаження:
echo Видаліть файл: %STARTUP_PATH%
echo.
echo Або запустіть: remove-from-startup.bat
echo.
pause
