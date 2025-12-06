# Smart Home Landing - Премиум сайт с конфигуратором

Премиум-лендинг для компании по умным домам с онлайн-конфигуратором.

## 🚀 Быстрый старт

### 1. Установка зависимостей

Откройте PowerShell от имени администратора и выполните:

```powershell
cd C:\Users\zxslivasx\Desktop\moskal_refactor\smart-home-landing
npm install
```

Если возникнет ошибка с политикой выполнения, выполните:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Затем снова:

```powershell
npm install
```

### 2. Запуск проекта

```powershell
npm run dev
```

Откройте браузер и перейдите на `http://localhost:3000`

## ✨ Особенности

- **Премиум-дизайн** с glassmorphism эффектами
- **Мультиязычность** (RU/EN)
- **Интерактивный конфигуратор** умного дома
- **Адаптивный дизайн** для всех устройств
- **Плавные анимации** и переходы

## 🛠 Технологии

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (для анимаций)

## 📁 Структура проекта

```
smart-home-landing/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Главная страница
│   │   ├── layout.tsx         # Корневой layout
│   │   └── globals.css        # Глобальные стили
│   └── components/
│       └── Configurator.tsx   # Компонент конфигуратора
├── tailwind.config.ts         # Конфигурация Tailwind
├── postcss.config.mjs         # Конфигурация PostCSS
└── package.json              # Зависимости
```

## 🎨 Кастомизация

Все стили находятся в `src/app/globals.css`. Основные цвета и эффекты можно изменить там.

## 📝 Скрипты

- `npm run dev` - Запуск dev-сервера
- `npm run build` - Сборка для production
- `npm run start` - Запуск production сервера
- `npm run lint` - Проверка кода

