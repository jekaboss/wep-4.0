@echo off
REM ========================================
REM WEP-3.0 - Запуск сервера
REM ========================================

cd /d "%~dp0"

echo ========================================
echo WEP-3.0 Server
echo ========================================
echo.
echo Перевірка Node.js...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ПОМИЛКА: Node.js не встановлено!
    echo.
    echo Встановіть з: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js знайдено!
echo.

if not exist "node_modules" (
    echo Встановлення залежностей...
    call npm install
    echo.
)

echo ========================================
echo Запуск сервера...
echo ========================================
echo.
echo Сервер: http://localhost:3000
echo.
echo Для виходу: Ctrl+C
echo.

node server.js
