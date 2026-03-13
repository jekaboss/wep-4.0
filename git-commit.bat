@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo WEP-3.0 - Git Commit
echo ========================================
echo.

REM Set user name and email
git config user.name "Your Name"
git config user.email "your@email.com"

REM Add all files
echo Додавання файлів...
git add .

REM Create commit
echo Створення коміту...
git commit -m "WEP-3.0 Initial commit"

echo.
echo ========================================
echo ГОТОВО!
echo ========================================
echo.
echo Тепер виконайте команди для завантаження на GitHub:
echo.
echo 1. Створіть репозиторій на https://github.com/new
echo 2. Виконайте: git remote add origin https://github.com/ВАШ_НІК/wep-3.0.git
echo 3. Виконайте: git push -u origin main
echo.
pause
