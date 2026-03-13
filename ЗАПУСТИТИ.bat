@echo off
REM ========================================
REM WEP-3.0 - Запуск і відкриття браузера
REM ========================================

cd /d "%~dp0"

echo ========================================
echo WEP-3.0 - Запуск...
echo ========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ПОМИЛКА: Node.js не встановлено!
    echo Встановіть з: https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Встановлення залежностей...
    call npm install
    echo.
)

echo Запуск сервера...
start "" cmd /k "node server.js"

timeout /t 3 /nobreak >nul

echo Відкриття браузера...
start "" "index.html"

echo.
echo ========================================
echo ГОТОВО! Сервер запущено!
echo ========================================
echo.
echo Браузер відкрито з index.html
echo Сервер працює на: http://localhost:3000
echo.
echo Для зупинки сервера закрийте вікно консолі
echo.
pause
