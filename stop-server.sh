#!/bin/bash
# ========================================
# WEP-Blocknot - Зупинка сервера
# ========================================

cd "$(dirname "$0")"

echo "========================================"
echo "WEP-Blocknot - Зупинка сервера"
echo "========================================"
echo ""

if [ -f "server.pid" ]; then
    PID=$(cat server.pid)
    if ps -p $PID > /dev/null; then
        echo "Зупинка сервера (PID: $PID)..."
        kill $PID
        rm server.pid
        echo "Сервер зупинено!"
    else
        echo "Сервер не запущено (PID не знайдено)..."
    fi
else
    # Try to find by process name
    PID=$(pgrep -f "node server.js")
    if [ -n "$PID" ]; then
        echo "Зупинка сервера (PID: $PID)..."
        kill $PID
        echo "Сервер зупинено!"
    else
        echo "Сервер не запущено!"
    fi
fi

echo ""
