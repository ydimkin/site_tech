<div align="center">

# TechPark — Educational Platform & Course Booking System

<p align="center">
  <b>A modern fullstack web application for educational centers, robotics academies, and STEM courses featuring interactive course booking, schedule management, and an analytical admin dashboard.</b>
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

## Overview

**TechPark** is an adaptive, end-to-end web platform engineered to automate course enrollment, student scheduling, and content management for modern educational centers and tech academies.

The system combines a reactive, mobile-first frontend with a robust, layered Go backend and automated containerized deployment workflows using Docker and Ansible.

---

## Key Features

### Public Portal (Students & Parents)
- **Course Exploration & Discovery**: Filter courses by category, difficulty level, and age bracket with instant search and markdown-rendered descriptions.
- **Seamless Booking Flow**: Quick enrollment module with instant validation and status indicators.
- **Interactive Schedule Matrix**: Filter timetable by age group, day of week, course, and classroom.
- **Personal Student Cabinet**: Track active and historical bookings, review personal data, and upload avatars.
- **Media & Knowledge Hub**: Real-time news blog, teacher directory, contact form, and official legal documents portal.
- **Modern UX/UI**: Dark and Light theme toggle, smooth micro-interactions powered by Framer Motion, and mobile-first responsiveness.

### Administration & Operations Portal
- **Analytics & Dashboard**: Live KPI metrics (total revenue, active bookings, user counts, popular courses) with interactive Recharts visualizations.
- **Booking Workflow Management**: Update booking statuses (`pending`, `confirmed`, `cancelled`), add administrative notes, and review parent contact info.
- **Course & Category Studio**: Rich CRUD interface with file uploads, syllabus authoring, and category tagging.
- **Schedule & Timetable Editor**: Create and modify weekly time slots, assign teachers, and allocate rooms.
- **Document & File Manager**: Upload and categorize PDF and document assets.
- **User & Role Management**: Role-based access control (`student`, `teacher`, `admin`) with account activation toggles.

### Backend Architecture & Security
- **Layered Clean Architecture**: Strict separation of concerns across Handlers, Services, Repositories/Models, and Middleware.
- **JWT Authentication & RBAC**: Secure stateless token authentication with role-enforced route guards.
- **Password Security**: Cryptographic hashing via bcrypt.
- **Database Migrations & Soft Deletes**: GORM automigrations with PostgreSQL foreign keys and `deleted_at` audit support.
- **File Upload Engine**: Sanitized local storage with static file serving and URL generation.

### DevOps & Production Readiness
- **Dual Docker Workflows**:
  - `dev`: Live hot-reloading with Air (Go) and Vite HMR (React) with volume bind-mounts.
  - `prod`: Optimized multi-stage Docker builds and Caddy 2 reverse proxy with automatic HTTPS / Let's Encrypt.
- **Ansible Automation**: Full deployment and management playbooks for local and remote VPS targets.
- **Makefile CLI**: Comprehensive task runner for one-command builds, runs, log streaming, and teardowns.

---

## Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | [Go (Golang) 1.22](https://golang.org) | High-performance compiled backend service |
| **Web Framework** | [Gin Gonic](https://gin-gonic.com) | Minimalist, high-speed HTTP web framework |
| **ORM & Database** | [GORM](https://gorm.io) / [PostgreSQL 16](https://www.postgresql.org) | Type-safe ORM & relational database |
| **Security** | [golang-jwt](https://github.com/golang-jwt/jwt) & bcrypt | Stateless JWT token validation and password hashing |
| **Frontend** | [React 18](https://react.dev) + [TypeScript](https://www.typescriptlang.org) | Reactive UI component architecture |
| **Build Tool** | [Vite 5](https://vitejs.dev) | Next-generation frontend tooling & HMR |
| **Styling & UI** | [Tailwind CSS 3](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com) | Utility-first CSS with accessible primitives |
| **State & Forms** | [Zustand](https://zustand-demo.pmnd.rs) + [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) | Lightweight global state & schema-validated forms |
| **Animations & Data** | [Framer Motion](https://www.framer.com/motion) + [Recharts](https://recharts.org) | Fluid UI animations and analytics charting |
| **Reverse Proxy** | [Caddy 2](https://caddyserver.com) | Production reverse proxy, static file server & Auto-TLS |
| **DevOps & Config** | [Docker](https://www.docker.com), [Ansible](https://www.ansible.com), [Make](https://www.gnu.org/software/make) | Containerization, deployment automation, and task runner |

---

## Architecture Overview

The system follows a three-tier client-server architecture:

1. **Client Tier**: Single Page Application built with React 18, TypeScript, Tailwind CSS, and Radix UI.
2. **Reverse Proxy & Gateway**: Caddy 2 web server handling static asset delivery, SPA routing fallback, automated TLS certificates via Let's Encrypt, and request routing to backend services.
3. **Application & Persistence Tier**: Containerized Go REST API (Gin + GORM) with layered architecture communicating over TCP with a PostgreSQL 16 database and mounted media storage volume.

---

## Project Structure

```
site_tech/
├── ansible/                        # Ansible automation playbooks
│   ├── inventory.yml.example       # Example server inventory configuration
│   ├── playbook.yml                # Main deploy and provisioning playbook
│   └── stop.yml                    # Service teardown playbook
├── ansible.cfg                     # Ansible CLI configuration
├── backend/                        # Go REST API backend
│   ├── cmd/server/                 # Application entry point (main.go)
│   ├── internal/
│   │   ├── config/                 # Environment & configuration loader
│   │   ├── handlers/               # HTTP controllers & request decoders
│   │   ├── middleware/             # JWT auth & RBAC authorization middleware
│   │   ├── models/                 # GORM database models & entities
│   │   ├── router/                 # API routing & route grouping
│   │   └── service/                # Core business logic layer
│   ├── pkg/                        # Shared utility packages (JWT, API Response)
│   ├── Dockerfile                  # Multi-stage production build
│   ├── Dockerfile.dev              # Development build with Air hot-reload
│   └── go.mod                      # Go module dependencies
├── frontend/                       # React + TypeScript frontend
│   ├── public/                     # Static public assets
│   ├── src/
│   │   ├── api/                    # Axios API client & typed endpoints
│   │   ├── components/             # Reusable UI & layout components
│   │   ├── pages/
│   │   │   ├── admin/              # Admin dashboard pages (Courses, Bookings, Stats...)
│   │   │   └── public/             # Public-facing views (Home, Courses, Schedule...)
│   │   ├── store/                  # Zustand stores (Auth, Theme)
│   │   ├── types/                  # TypeScript interfaces & DTOs
│   │   └── utils/                  # Helper functions & Markdown parsers
│   ├── Caddyfile                   # Caddy web server routing rules
│   ├── Dockerfile                  # Production build & Caddy container
│   ├── Dockerfile.dev              # Development container
│   ├── tailwind.config.js          # Tailwind CSS design system configuration
│   └── vite.config.ts              # Vite configuration & dev proxy
├── docker-compose.yml              # Base Docker Compose service definition
├── docker-compose.dev.yml          # Development override (Air, Vite dev server, mounts)
├── docker-compose.prod.yml         # Production override (Caddy static, compiled binary)
├── docker-compose.deploy.yml       # Production VPS reverse-proxy override
├── .env.example                    # Global environment configuration template
├── Makefile                        # CLI shortcut commands
├── README.md                       # English documentation
└── README-ru.md                    # Russian documentation
```

---

## Quick Start

### Prerequisites
- Docker (v24.0+) & Docker Compose (v2.0+)
- Make (optional, recommended)
- Go 1.22+ & Node.js 20+ (only for local manual execution without Docker)

### 1. Clone & Configure
```bash
git clone https://github.com/ydimkin/site_tech.git
cd site_tech

# Copy the environment configuration template
cp .env.example .env
```

### 2. Run in Development Mode
Launch the application with hot-reloading enabled for both Backend (Air) and Frontend (Vite):
```bash
make dev
```
Endpoints:
- Frontend (Vite HMR): http://localhost:5173
- Backend REST API: http://localhost:8080
- Health Check: http://localhost:8080/health

### 3. Run in Production Mode
Build and run the optimized multi-stage containerized setup with Caddy reverse proxy:
```bash
make prod
```
Endpoints:
- Production Web App: http://localhost

---

## Configuration (.env)

The project uses a single unified `.env` file for all services:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DOMAIN` | `localhost` | Application host domain name |
| `DB_USER` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `site_tech` | PostgreSQL database name |
| `DB_SSLMODE` | `disable` | PostgreSQL SSL mode (`disable` / `require`) |
| `JWT_SECRET` | `replace_me_with_random_hex` | Cryptographic secret key for JWT signing |
| `JWT_EXPIRES_HOURS` | `168` | JWT token expiration time in hours |
| `SESSION_LIFETIME_DAYS` | `2` | Client session duration in days |
| `CORS_ORIGINS` | `http://localhost,http://localhost:80,http://localhost:5173` | Allowed CORS origins (comma-separated) |
| `PORT_FRONTEND` | `5173` (dev) / `80` (prod) | Host port binding for frontend |
| `PORT_BACKEND` | `8080` | Host port binding for backend |
| `PORT_DB` | `5432` | Host port binding for PostgreSQL |

---

## Makefile Command Reference

| Command | Description |
| :--- | :--- |
| `make dev` | Start development stack (hot reload, Vite on `:5173`, Air on `:8080`) |
| `make prod` | Start production stack (Caddy on `:80`, compiled Go binary) |
| `make dev-down` | Stop and remove development containers |
| `make prod-down` | Stop and remove production containers |
| `make dev-logs` | Follow live container logs for the development environment |
| `make prod-logs` | Follow live container logs for the production environment |
| `make dev-build` | Rebuild development images without Docker cache |
| `make prod-build` | Rebuild production images without Docker cache |
| `make clean` | Stop all running containers across both profiles |
| `make ansible-dev` | Run local provisioning via Ansible playbook (`env=dev`) |
| `make ansible-prod` | Run local provisioning via Ansible playbook (`env=prod`) |
| `make ansible-deploy` | Deploy to remote servers via Ansible inventory (`env=deploy`) |

---

## REST API Summary

### Authentication & Profile (/api/v1/auth)
- `POST /api/v1/auth/register` — Register a new student/parent account
- `POST /api/v1/auth/login` — Authenticate and receive JWT token
- `GET /api/v1/auth/me` — Retrieve current user profile (Auth required)
- `PUT /api/v1/auth/me` — Update user profile details (Auth required)
- `DELETE /api/v1/auth/me/avatar` — Remove profile avatar (Auth required)

### Courses & Categories (/api/v1/courses, /api/v1/categories)
- `GET /api/v1/courses` — List all courses with filtering & pagination
- `GET /api/v1/courses/featured` — Get featured courses for homepage
- `GET /api/v1/courses/:id` — Get detailed course information
- `POST /api/v1/courses` — Create a new course (Admin/Teacher)
- `PUT /api/v1/courses/:id` — Update course details (Admin/Teacher)
- `DELETE /api/v1/courses/:id` — Delete a course (Admin)
- `GET /api/v1/courses/:id/reviews` — Get reviews for a course
- `POST /api/v1/courses/:id/reviews` — Submit a course review (Auth required)
- `GET /api/v1/categories` — List all course categories

### Bookings (/api/v1/bookings)
- `POST /api/v1/bookings` — Create a new course booking application (Auth required)
- `GET /api/v1/bookings` — Get all bookings for current user (Auth required)
- `GET /api/v1/bookings/:id` — Get booking details (Auth required)
- `DELETE /api/v1/bookings/:id` — Cancel a booking application (Auth required)

### Schedule & Documents (/api/v1/schedules, /api/v1/documents)
- `GET /api/v1/schedules` — Get public weekly schedule
- `GET /api/v1/documents` — Get public educational documents & licenses

### Admin Operations (/api/v1/admin)
- `GET /api/v1/admin/stats` — Aggregate metrics & analytics (Admin)
- `GET /api/v1/admin/bookings` — List all bookings across all users (Admin)
- `PUT /api/v1/admin/bookings/:id/status` — Update booking status (Admin)
- `GET /api/v1/admin/users` — List registered users (Admin)
- `PUT /api/v1/admin/users/:id/role` — Modify user role (`student`, `teacher`, `admin`) (Admin)
- `PUT /api/v1/admin/users/:id/toggle` — Toggle user active state (Admin)
- `GET /api/v1/admin/contacts` — List contact form submissions (Admin)

---

## License

This project is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

<div align="center">
  <b>Developed by <a href="https://github.com/ydimkin">ydimkin</a></b>
</div>
