@echo off
REM ========================================
REM WEP-3.0 - Запуск сервера з мережевим доступом
REM ========================================

cd /d "%~dp0"

echo ========================================
echo WEP-3.0 Server
echo ========================================
echo.
echo Перевірка встановлення Node.js...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ПОМИЛКА: Node.js не встановлено!
    echo.
    echo Встановіть Node.js з: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js знайдено!
echo.
echo Перевірка залежностей...
echo.

if not exist "node_modules" (
    echo Встановлення залежностей (npm install)...
    echo.
    call npm install
    echo.
)

echo ========================================
echo Запуск сервера...
echo ========================================
echo.
echo Для виходу натисніть Ctrl+C
echo.

start "" cmd /k "node server.js"

timeout /t 2 /nobreak >nul

echo.
echo Сервер запущено у фоновому режимі!
echo.
echo Відкрити у браузері? (Y/N)
set /p OPEN_BROWSER=
if /i "%OPEN_BROWSER%"=="Y" (
    start "" "http://localhost:3000"
)

echo.
echo ========================================
echo ГОТОВО!
echo ========================================
echo.
