#!/bin/bash
# ========================================
# WEP-3.0 - Запуск Electron додатка
# ========================================

cd "$(dirname "$0")"

echo "========================================"
echo "WEP-3.0 - Запуск..."
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Встановлення залежностей..."
    echo ""
    npm install
    echo ""
fi

echo "Запуск Electron..."
echo ""
npm run electron
