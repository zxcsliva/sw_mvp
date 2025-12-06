# Скрипт установки зависимостей для Smart Home Landing
# Запустите от имени администратора: .\install.ps1

Write-Host "Установка зависимостей для Smart Home Landing..." -ForegroundColor Green

# Проверка Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Ошибка: Node.js не установлен!" -ForegroundColor Red
    Write-Host "Установите Node.js с https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Проверка npm
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Ошибка: npm не найден!" -ForegroundColor Red
    exit 1
}

# Установка зависимостей
Write-Host "Установка npm пакетов..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Установка завершена успешно!" -ForegroundColor Green
    Write-Host "`nЗапустите проект командой: npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Ошибка при установке зависимостей" -ForegroundColor Red
    exit 1
}

