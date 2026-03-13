# 📤 Як завантажити WEP-3.0 на GitHub

## Спосіб 1: Через Git (рекомендовано)

### Крок 1: Встановіть Git (якщо ще немає)
Завантажте з: https://git-scm.com/downloads

### Крок 2: Відкрийте термінал у папці проекту
```bash
cd c:\Users\женя\Desktop\wep-2.0\wep-2.0-main
```

### Крок 3: Ініціалізуйте Git репозиторій
```bash
git init
```

### Крок 4: Додайте всі файли
```bash
git add .
```

### Крок 5: Зробіть перший коміт
```bash
git commit -m "WEP-3.0 - Initial commit"
```

### Крок 6: Створіть репозиторій на GitHub
1. Відкрийте https://github.com/new
2. Введіть назву: `wep-3.0`
3. Оберіть Private або Public
4. **НЕ натискайте** "Initialize this repository with a README"
5. Натисніть "Create repository"

### Крок 7: Прив'яжіть локальний репозиторій до GitHub
```bash
git remote add origin https://github.com/ВАШ_НІК/wep-3.0.git
```

### Крок 8: Завантажте файли на GitHub
```bash
git branch -M main
git push -u origin main
```

**Готово!** 🎉

---

## Спосіб 2: Через GitHub Desktop (для початківців)

### Крок 1: Встановіть GitHub Desktop
Завантажте з: https://desktop.github.com/

### Крок 2: Відкрийте GitHub Desktop
1. File → Add Local Repository
2. Оберіть папку: `c:\Users\женя\Desktop\wep-2.0\wep-2.0-main`
3. Натисніть "Add repository"

### Крок 3: Опублікуйте на GitHub
1. File → Publish repository
2. Введіть назву: `wep-3.0`
3. Оберіть Private або Public
4. Натисніть "Publish repository"

**Готово!** 🎉

---

## Спосіб 3: Через веб-інтерфейс (без Git)

### Крок 1: Створіть репозиторій
1. Відкрийте https://github.com/new
2. Введіть назву: `wep-3.0`
3. Натисніть "Create repository"

### Крок 2: Завантажте файли
1. Натисніть "uploading an existing file"
2. Перетягніть всі файли з папки
3. Натисніть "Commit changes"

**Готово!** 🎉

---

## 🌐 Деплой на Vercel (для роботи з будь-якого пристрою)

### Крок 1: Завантажте проект на GitHub
(див. інструкцію вище)

### Крок 2: Підключіть Vercel
1. Відкрийте https://vercel.com/
2. Увійдіть через GitHub
3. Натисніть "Add New Project"
4. Оберіть ваш репозиторій `wep-3.0`
5. Натисніть "Deploy"

### Крок 3: Готово!
Vercel надасть вам URL типу:
```
https://wep-3-0.vercel.app
```

**Тепер ваш проект доступний з будь-якого пристрою!** 🌍

---

## ⚠️ Важливо!

### Файли які НЕ завантажуються (добре):
- `node_modules/` - залежності npm
- `cheatsheets-data/` - ваші особисті шпаргалки
- `.git/` - службові файли Git
- `*.log` - логи

### Файли які завантажуються:
- Всі `.html`, `.css`, `.js` файли
- `package.json` - залежності проекту
- `server.js` - серверний код
- `README.md` - документація
- Всі `.bat` та `.sh` файли

---

## 🔗 Корисні посилання

- Git: https://git-scm.com/
- GitHub: https://github.com/
- GitHub Desktop: https://desktop.github.com/
- Vercel: https://vercel.com/
- Render: https://render.com/
- Railway: https://railway.app/

---

**WEP-3.0 © 2025**
