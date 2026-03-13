@echo off
REM ========================================
REM WEP-3.0 - Remove from Windows Startup
REM ========================================

set STARTUP_PATH="%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\WEP-3.0.vbs"

echo ========================================
echo WEP-3.0 - Видалення з автозавантаження
echo ========================================
echo.

if exist %STARTUP_PATH% (
    del /Q %STARTUP_PATH%
    echo.
    echo ГОТОВО! WEP-3.0 видалено з автозавантаження.
    echo.
) else (
    echo.
    echo WEP-3.0 НЕ знайдено в автозавантаженні.
    echo.
)

pause
