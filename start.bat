@echo off
chcp 65001 >nul
REM ========================================
REM WEP-3.0 - Універсальний запуск
REM ========================================

cd /d "%~dp0"

:MENU
cls
echo ========================================
echo    WEP-3.0 - Меню запуску
echo ========================================
echo.
echo Оберіть опцію:
echo.
echo  1. Запустити сервер (фоновий режим)
echo  2. Запустити сервер (у цьому вікні)
echo  3. Запустити Electron додаток
echo  4. Запустити з мережевим доступом
echo  5. Додати до автозавантаження
echo  6. Видалити з автозавантаження
echo  7. Відкрити у браузері
echo  8. Вийти
echo.
echo ========================================
set /p CHOICE="Ваш вибір: "

if "%CHOICE%"=="1" goto START_SERVER
if "%CHOICE%"=="2" goto START_SERVER_CONSOLE
if "%CHOICE%"=="3" goto START_ELECTRON
if "%CHOICE%"=="4" goto START_NETWORK
if "%CHOICE%"=="5" goto ADD_STARTUP
if "%CHOICE%"=="6" goto REMOVE_STARTUP
if "%CHOICE%"=="7" goto OPEN_BROWSER
if "%CHOICE%"=="8" goto EXIT

echo Невірний вибір! Натисніть будь-яку клавішу...
pause >nul
goto MENU

:START_SERVER
cls
echo ========================================
echo Запуск сервера...
echo ========================================
echo.
if not exist "node_modules" (
    echo Встановлення залежностей...
    call npm install
    echo.
)
start "" cmd /k "node server.js"
timeout /t 2 /nobreak >nul
echo Сервер запущено!
echo.
pause
goto MENU

:START_SERVER_CONSOLE
cls
echo ========================================
echo Запуск сервера у консолі...
echo ========================================
echo.
if not exist "node_modules" (
    echo Встановлення залежностей...
    call npm install
    echo.
)
node server.js
goto MENU

:START_ELECTRON
cls
echo ========================================
echo Запуск Electron додатка...
echo ========================================
echo.
if not exist "node_modules" (
    echo Встановлення залежностей...
    call npm install
    echo.
)
npm run electron
goto MENU

:START_NETWORK
cls
echo ========================================
echo Запуск з мережевим доступом...
echo ========================================
echo.
if not exist "node_modules" (
    echo Встановлення залежностей...
    call npm install
    echo.
)
start "" cmd /k "node server.js"
timeout /t 2 /nobreak >nul
echo.
echo Сервер запущено!
echo Відкрийте у браузері: http://localhost:3000
echo.
pause
goto MENU

:ADD_STARTUP
cls
call add-to-startup.bat
goto MENU

:REMOVE_STARTUP
cls
call remove-from-startup.bat
goto MENU

:OPEN_BROWSER
cls
echo ========================================
echo Відкриття у браузері...
echo ========================================
echo.
start "" "http://localhost:3000"
echo Браузер відкрито!
echo.
pause
goto MENU

:EXIT
cls
echo ========================================
echo Дякуємо за використання WEP-3.0!
echo ========================================
echo.
exit /b
