<div align="center">

# Детский Технопарк — Образовательная платформа и система бронирования курсов

<p align="center">
  <b>Современное Fullstack веб-приложение для детских образовательных центров, академий робототехники и IT-курсов с интерактивной записью на занятия, гибким расписанием и аналитической панелью администратора.</b>
</p>

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

[Читать на русском](README-ru.md) | [Read in English](README.md)

</div>

---

## О проекте

**«Детский Технопарк»** — это готовая к продакшену платформа, разработанная для комплексной автоматизации процессов записи на курсы, ведения расписания и управления контентом учебного центра.

Проект объединяет реактивный клиентский интерфейс на React/TypeScript, производительный бэкенд на Go со слоистой архитектурой и контейнеризированное развёртывание с помощью Docker и Ansible.

---

## Основные возможности

### Публичный портал (для родителей и учеников)
- **Каталог и поиск курсов**: Фильтрация по категориям, уровням сложности и возрасту ребёнка, подробные описания с поддержкой Markdown.
- **Онлайн-бронирование**: Быстрое оформление заявки с мгновенной валидацией и отображением текущего статуса.
- **Интерактивное расписание**: Недельная сетка занятий с фильтрацией по дням, группам, курсам и аудиториям.
- **Личный кабинет ученика**: История и активные заявки, персональные данные, загрузка аватара.
- **Информационные разделы**: Блог новостей, каталог преподавателей, библиотека официальных документов и форма обратной связи.
- **Адаптивный интерфейс**: Переключение Тёмной/Светлой темы, плавные анимации на Framer Motion, полная мобильная адаптация.

### Панель администратора
- **Аналитический дашборд**: Сводные KPI (выручка, активные бронирования, пользователи) и интерактивные графики (Recharts).
- **Управление заявками**: Модерация и смена статусов (`pending`, `confirmed`, `cancelled`), служебные заметки, контакты родителей.
- **Конструктор курсов и категорий**: Полный CRUD с загрузкой обложек, настройкой цен, возраста и длительности.
- **Редактор расписания**: Создание и редактирование временных слотов, привязка преподавателей и аудиторий.
- **Файловый менеджер**: Загрузка и структурирование официальных документов и PDF-файлов.
- **Управление доступом (RBAC)**: Разграничение ролей (`student`, `teacher`, `admin`), блокировка/активация аккаунтов.

### Бэкенд и безопасность
- **Слоистая архитектура**: Чёткое разделение на контроллеры (Handlers), бизнес-логику (Services), модели данных (Models) и Middleware.
- **JWT-аутентификация и RBAC**: Безопасная валидация токенов и защита маршрутов по ролям.
- **Безопасность паролей**: Криптографическое хеширование через bcrypt.
- **Миграции и Soft Delete**: Автомиграции GORM, внешние ключи и аудит мягкого удаления (`deleted_at`).
- **Загрузка файлов**: Изолированное хранилище медиа-файлов со статической раздачей.

### DevOps и развёртывание
- **Два профиля окружения**:
  - `dev`: Мгновенный Hot Reload через Air (Go) и Vite HMR (React) с bind mount директорий.
  - `prod`: Оптимизированный multi-stage билд, веб-сервер Caddy 2 с автоматическим выпуском SSL/TLS (HTTPS Let's Encrypt).
- **Автоматизация Ansible**: Готовые плейбуки для локального запуска и деплоя на удалённый VPS.
- **Makefile**: Удобный CLI-интерфейс для запуска, пересборки, просмотра логов и остановки сервисов.

---

## Стек технологий

| Область | Технология | Описание |
| :--- | :--- | :--- |
| **Бэкенд** | [Go (Golang) 1.22](https://golang.org) | Высокопроизводительный компилируемый язык |
| **HTTP-фреймворк** | [Gin Gonic](https://gin-gonic.com) | Быстрый и минималистичный web-фреймворк |
| **ORM и База данных** | [GORM](https://gorm.io) / [PostgreSQL 16](https://www.postgresql.org) | Типобезопасная ORM и реляционная СУБД |
| **Аутентификация** | [golang-jwt](https://github.com/golang-jwt/jwt) & bcrypt | JWT-токены и безопасное хеширование паролей |
| **Фронтенд** | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | Компонентная реактивная архитектура |
| **Сборщик** | [Vite 5](https://vitejs.dev) | Быстрая сборка и Hot Module Replacement |
| **Стилизация и UI** | [Tailwind CSS 3](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com) | Утилитарные стили и доступные UI-примитивы |
| **Состояние и Формы** | [Zustand](https://zustand-demo.pmnd.rs) + [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Легковесный стейт-менеджер и валидация схем |
| **Анимации и Графика** | [Framer Motion](https://www.framer.com/motion) + [Recharts](https://recharts.org) | Плавные анимации интерфейса и аналитические графики |
| **Веб-сервер / Прокси** | [Caddy 2](https://caddyserver.com) | Reverse-proxy, раздача статики и авто-HTTPS |
| **DevOps** | [Docker](https://www.docker.com), [Ansible](https://www.ansible.com), [Make](https://www.gnu.org/software/make) | Контейнеризация, оркестрация и автоматизация |

---

## Архитектура системы

Архитектура платформы построена по классической клиент-серверной модели:

1. **Клиентский уровень**: Одностраничное приложение (SPA) на React 18 с TypeScript, Tailwind CSS и Radix UI.
2. **Шлюз и обратный прокси**: Веб-сервер Caddy 2, отвечающий за раздачу клиентской статики, маршрутизацию SPA, автоматическое получение TLS-сертификатов Let's Encrypt и проксирование запросов к API.
3. **Серверный уровень и данные**: Изолированные в Docker-сети сервис REST API на Go (Gin + GORM) и реляционная СУБД PostgreSQL 16 с постоянным томом для данных и хранилищем загруженных файлов.

---

## Структура проекта

```
site_tech/
├── ansible/                        # Сценарии автоматизации Ansible
│   ├── inventory.yml.example       # Шаблон конфигурации серверов
│   ├── playbook.yml                # Основной плейбук деплоя
│   └── stop.yml                    # Плейбук остановки сервисов
├── ansible.cfg                     # Конфигурация Ansible CLI
├── backend/                        # Исходный код Go REST API
│   ├── cmd/server/                 # Точка входа (main.go)
│   ├── internal/
│   │   ├── config/                 # Загрузчик переменных окружения
│   │   ├── handlers/               # HTTP-обработчики (контроллеры)
│   │   ├── middleware/             # Middleware (JWT, роли)
│   │   ├── models/                 # GORM-модели и сущности БД
│   │   ├── router/                 # Маршруты и группы API
│   │   └── service/                # Слой бизнес-логики
│   ├── pkg/                        # Вспомогательные пакеты (JWT, Response)
│   ├── Dockerfile                  # Multi-stage сборка для Production
│   ├── Dockerfile.dev              # Сборка для Development (Air)
│   └── go.mod                      # Зависимости Go
├── frontend/                       # Исходный код React + TypeScript
│   ├── public/                     # Статические ресурсы
│   ├── src/
│   │   ├── api/                    # Клиент Axios и типизированные запросы
│   │   ├── components/             # UI-компоненты и макеты
│   │   ├── pages/
│   │   │   ├── admin/              # Страницы панели управления (Курсы, Заявки...)
│   │   │   └── public/             # Публичные страницы (Главная, Курсы, Расписание...)
│   │   ├── store/                  # Zustand-хранилища (Auth, Theme)
│   │   ├── types/                  # Интерфейсы TypeScript
│   │   └── utils/                  # Утилиты и парсер Markdown
│   ├── Caddyfile                   # Конфигурация веб-сервера Caddy
│   ├── Dockerfile                  # Сборка для Production (Caddy)
│   ├── Dockerfile.dev              # Контейнер для Development
│   ├── tailwind.config.js          # Конфигурация Tailwind CSS
│   └── vite.config.ts              # Конфигурация Vite и proxy
├── docker-compose.yml              # Базовый файл Docker Compose
├── docker-compose.dev.yml          # Override для Development (Vite HMR, Air)
├── docker-compose.prod.yml         # Override для Production (Caddy, бинарник Go)
├── docker-compose.deploy.yml       # Override для VPS (внешняя сеть Caddy)
├── .env.example                    # Шаблон конфигурации переменных окружения
├── Makefile                        # Команды автоматизации Make
├── README.md                       # Документация на английском языке
└── README-ru.md                    # Документация на русском языке
```

---

## Быстрый старт

### Системные требования
- Docker (v24.0+) и Docker Compose (v2.0+)
- Make (рекомендуется)
- Go 1.22+ и Node.js 20+ (только для локальной сборки без Docker)

### 1. Клонирование и настройка
```bash
git clone https://github.com/ydimkin/site_tech.git
cd site_tech

# Создание конфигурационного файла из шаблона
cp .env.example .env
```

### 2. Запуск в режиме разработки (Development)
Запуск с поддержкой горячей перезагрузки для бэкенда (Air) и фронтенда (Vite HMR):
```bash
make dev
```
Точки доступа:
- Фронтенд (Vite): http://localhost:5173
- Бэкенд REST API: http://localhost:8080
- Проверка здоровья (Health Check): http://localhost:8080/health

### 3. Запуск в режиме продакшена (Production)
Сборка оптимизированных образов с веб-сервером Caddy:
```bash
make prod
```
Точки доступа:
- Веб-приложение: http://localhost

---

## Переменные окружения (.env)

Проект использует единый конфигурационный файл `.env`:

| Переменная | Значение по умолчанию | Описание |
| :--- | :--- | :--- |
| `DOMAIN` | `localhost` | Доменное имя приложения |
| `DB_USER` | `postgres` | Пользователь PostgreSQL |
| `DB_PASSWORD` | `postgres` | Пароль к PostgreSQL |
| `DB_NAME` | `site_tech` | Название базы данных |
| `DB_SSLMODE` | `disable` | Режим SSL для БД (`disable` / `require`) |
| `JWT_SECRET` | `replace_me_with_random_hex` | Секретный ключ подписи JWT-токенов |
| `JWT_EXPIRES_HOURS` | `168` | Время жизни токена (в часах) |
| `SESSION_LIFETIME_DAYS` | `2` | Длительность сессии клиента (в днях) |
| `CORS_ORIGINS` | `http://localhost,http://localhost:80,http://localhost:5173` | Разрешённые CORS-источники |
| `PORT_FRONTEND` | `5173` (dev) / `80` (prod) | Порт фронтенда на хосте |
| `PORT_BACKEND` | `8080` | Порт бэкенда на хосте |
| `PORT_DB` | `5432` | Порт PostgreSQL на хосте |

---

## Справочник команд Makefile

| Команда | Описание |
| :--- | :--- |
| `make dev` | Запуск dev-окружения (hot reload, Vite на `:5173`, Air на `:8080`) |
| `make prod` | Запуск prod-окружения (Caddy на `:80`, скомпилированный бинарник) |
| `make dev-down` | Остановка и удаление dev-контейнеров |
| `make prod-down` | Остановка и удаление prod-контейнеров |
| `make dev-logs` | Просмотр логов dev-контейнеров в реальном времени |
| `make prod-logs` | Просмотр логов prod-контейнеров в реальном времени |
| `make dev-build` | Пересборка dev-образов без использования кэша |
| `make prod-build` | Пересборка prod-образов без использования кэша |
| `make clean` | Полная остановка всех контейнеров проекта |
| `make ansible-dev` | Локальный запуск через Ansible (`env=dev`) |
| `make ansible-prod` | Локальный запуск через Ansible (`env=prod`) |
| `make ansible-deploy` | Деплой на удалённый VPS через Ansible (`env=deploy`) |

---

## Основные эндпоинты REST API

### Аутентификация и профиль (/api/v1/auth)
- `POST /api/v1/auth/register` — Регистрация нового пользователя
- `POST /api/v1/auth/login` — Вход в систему и получение JWT-токена
- `GET /api/v1/auth/me` — Получение профиля текущего пользователя (Требуется Auth)
- `PUT /api/v1/auth/me` — Обновление данных профиля (Требуется Auth)
- `DELETE /api/v1/auth/me/avatar` — Удаление аватара (Требуется Auth)

### Курсы и категории (/api/v1/courses, /api/v1/categories)
- `GET /api/v1/courses` — Список курсов с фильтрацией и пагинацией
- `GET /api/v1/courses/featured` — Популярные курсы для главной страницы
- `GET /api/v1/courses/:id` — Подробная информация о курсе
- `POST /api/v1/courses` — Создание курса (Admin/Teacher)
- `PUT /api/v1/courses/:id` — Редактирование курса (Admin/Teacher)
- `DELETE /api/v1/courses/:id` — Удаление курса (Admin)
- `GET /api/v1/courses/:id/reviews` — Отзывы о курсе
- `POST /api/v1/courses/:id/reviews` — Добавление отзыва (Требуется Auth)
- `GET /api/v1/categories` — Список категорий курсов

### Бронирование (/api/v1/bookings)
- `POST /api/v1/bookings` — Создание заявки на курс (Требуется Auth)
- `GET /api/v1/bookings` — Заявки текущего пользователя (Требуется Auth)
- `GET /api/v1/bookings/:id` — Детали конкретной заявки (Требуется Auth)
- `DELETE /api/v1/bookings/:id` — Отмена заявки (Требуется Auth)

### Расписание и документы (/api/v1/schedules, /api/v1/documents)
- `GET /api/v1/schedules` — Публичное недельное расписание
- `GET /api/v1/documents` — Официальные документы и лицензии

### Панель администратора (/api/v1/admin)
- `GET /api/v1/admin/stats` — Сводные аналитические метрики (Admin)
- `GET /api/v1/admin/bookings` — Список всех заявок всех пользователей (Admin)
- `PUT /api/v1/admin/bookings/:id/status` — Изменение статуса заявки (Admin)
- `GET /api/v1/admin/users` — Список зарегистрированных пользователей (Admin)
- `PUT /api/v1/admin/users/:id/role` — Смена роли пользователя (`student`, `teacher`, `admin`) (Admin)
- `PUT /api/v1/admin/users/:id/toggle` — Блокировка / разблокировка пользователя (Admin)
- `GET /api/v1/admin/contacts` — Сообщения из формы обратной связи (Admin)

---

## Лицензия

Проект распространяется под открытой лицензией [MIT License](https://opensource.org/licenses/MIT).

---

<div align="center">
  <b>Разработано: <a href="https://github.com/ydimkin">ydimkin</a></b>
</div>
