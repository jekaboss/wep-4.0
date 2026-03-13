#!/bin/bash
# ========================================
# WEP-3.0 - Запуск сервера з мережевим доступом
# ========================================

cd "$(dirname "$0")"

echo "========================================"
echo "WEP-3.0 Server"
echo "========================================"
echo ""
echo "Перевірка встановлення Node.js..."
echo ""

if ! command -v node &> /dev/null; then
    echo "ПОМИЛКА: Node.js не встановлено!"
    echo ""
    echo "Встановіть Node.js:"
    echo "  Mac:  brew install node"
    echo "  Linux: sudo apt install nodejs npm"
    echo ""
    exit 1
fi

echo "Node.js знайдено!"
echo ""
echo "Перевірка залежностей..."
echo ""

if [ ! -d "node_modules" ]; then
    echo "Встановлення залежностей (npm install)..."
    echo ""
    npm install
    echo ""
fi

echo "========================================"
echo "Запуск сервера..."
echo "========================================"
echo ""
echo "Для виходу натисніть Ctrl+C"
echo ""

# Start server in background
nohup node server.js > server.log 2>&1 &
SERVER_PID=$!

echo $SERVER_PID > server.pid

sleep 2

echo ""
echo "Сервер запущено у фоновому режимі (PID: $SERVER_PID)!"
echo ""
echo "Лог файл: server.log"
echo ""

# Get local IP
IP=$(hostname -I | awk '{print $1}')
if [ -z "$IP" ]; then
    IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)
fi

echo "========================================"
echo "Доступ:"
echo "  Локально:  http://localhost:3000"
echo "  Мережа:    http://$IP:3000"
echo "========================================"
echo ""
