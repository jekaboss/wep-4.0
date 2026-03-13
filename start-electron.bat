@echo off
REM ========================================
REM WEP-3.0 - Запуск Electron додатка
REM ========================================

cd /d "%~dp0"

echo ========================================
echo WEP-3.0 - Запуск...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Встановлення залежностей...
    echo.
    npm install
    echo.
)

echo Запуск Electron...
echo.
npm run electron
