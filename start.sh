#!/bin/bash
# ========================================
# WEP-3.0 - Універсальний запуск
# ========================================

cd "$(dirname "$0")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_menu() {
    clear
    echo "========================================"
    echo "   WEP-3.0 - Меню запуску"
    echo "========================================"
    echo ""
    echo "Оберіть опцію:"
    echo ""
    echo "  1. Запустити сервер (фоновий режим)"
    echo "  2. Запустити сервер (у консолі)"
    echo "  3. Запустити Electron додаток"
    echo "  4. Запустити з мережевим доступом"
    echo "  5. Відкрити у браузері"
    echo "  6. Зупинити сервер"
    echo "  7. Вийти"
    echo ""
    echo "========================================"
    echo -n "Ваш вибір: "
}

start_server_bg() {
    clear
    echo "========================================"
    echo "Запуск сервера..."
    echo "========================================"
    echo ""
    
    if [ ! -d "node_modules" ]; then
        echo "Встановлення залежностей..."
        npm install
        echo ""
    fi
    
    nohup node server.js > server.log 2>&1 &
    echo $! > server.pid
    
    sleep 2
    echo -e "${GREEN}Сервер запущено!${NC}"
    echo "Лог файл: server.log"
    echo ""
    echo -n "Натисніть Enter для продовження..."
    read
}

start_server_console() {
    clear
    echo "========================================"
    echo "Запуск сервера у консолі..."
    echo "========================================"
    echo ""
    
    if [ ! -d "node_modules" ]; then
        echo "Встановлення залежностей..."
        npm install
        echo ""
    fi
    
    node server.js
}

start_electron() {
    clear
    echo "========================================"
    echo "Запуск Electron додатка..."
    echo "========================================"
    echo ""
    
    if [ ! -d "node_modules" ]; then
        echo "Встановлення залежностей..."
        npm install
        echo ""
    fi
    
    npm run electron
}

start_network() {
    clear
    echo "========================================"
    echo "Запуск з мережевим доступом..."
    echo "========================================"
    echo ""
    
    if [ ! -d "node_modules" ]; then
        echo "Встановлення залежностей..."
        npm install
        echo ""
    fi
    
    ./start-server-network.sh
    
    echo ""
    echo -n "Натисніть Enter для продовження..."
    read
}

open_browser() {
    clear
    echo "========================================"
    echo "Відкриття у браузері..."
    echo "========================================"
    echo ""
    
    # Detect OS and open browser
    case "$(uname -s)" in
        Darwin*)    open "http://localhost:3000" ;;
        Linux*)     xdg-open "http://localhost:3000" 2>/dev/null || sensible-browser "http://localhost:3000" ;;
        *)          echo "Відкрийте браузер та перейдіть на: http://localhost:3000" ;;
    esac
    
    echo "Браузер відкрито!"
    echo ""
    echo -n "Натисніть Enter для продовження..."
    read
}

stop_server() {
    clear
    echo "========================================"
    echo "Зупинка сервера..."
    echo "========================================"
    echo ""
    
    ./stop-server.sh
    
    echo ""
    echo -n "Натисніть Enter для продовження..."
    read
}

# Main loop
while true; do
    show_menu
    read CHOICE
    
    case $CHOICE in
        1) start_server_bg ;;
        2) start_server_console ;;
        3) start_electron ;;
        4) start_network ;;
        5) open_browser ;;
        6) stop_server ;;
        7) clear; echo "Дякуємо за використання WEP-3.0!"; exit 0 ;;
        *) echo "Невірний вибір!"; sleep 2 ;;
    esac
done
