ENV := .env

COMPOSE_DEV  := -f docker-compose.yml -f docker-compose.dev.yml
COMPOSE_PROD := -f docker-compose.yml -f docker-compose.prod.yml

PROJ_DEV  := site_tech_dev
PROJ_PROD := site_tech_prod

.PHONY: help dev prod dev-down prod-down dev-logs prod-logs dev-build prod-build \
        ansible-dev ansible-prod ansible-deploy ansible-stop-dev ansible-stop-prod ansible-stop-deploy ansible-rebuild-dev clean

help:
	@echo "site_tech — команды:"
	@echo ""
	@echo "  Docker compose напрямую:"
	@echo "    make dev          — запустить dev (hot reload, vite на :5173)"
	@echo "    make prod         — запустить prod (caddy на :80)"
	@echo "    make dev-down     — остановить dev"
	@echo "    make prod-down    — остановить prod"
	@echo "    make dev-logs     — логи dev"
	@echo "    make prod-logs    — логи prod"
	@echo "    make dev-build    — пересобрать dev образы"
	@echo "    make prod-build   — пересобрать prod образы"
	@echo ""
	@echo "  Через Ansible:"
	@echo "    make ansible-dev          — запуск dev через playbook"
	@echo "    make ansible-prod         — запуск prod через playbook"
	@echo "    make ansible-deploy       — запуск deploy (VPS с Caddy) через playbook"
	@echo "    make ansible-rebuild-deploy  — пересборка + запуск deploy (VPS с Caddy) через playbook"
	@echo "    make ansible-rebuild-dev  — пересборка + запуск dev"
	@echo "    make ansible-stop-dev     — остановить dev"
	@echo "    make ansible-stop-prod    — остановить prod"
	@echo "    make ansible-stop-deploy  — остановить deploy (VPS)"



dev:
	docker compose --project-name $(PROJ_DEV) --env-file $(ENV) $(COMPOSE_DEV) up -d --build
	@echo "✓ Frontend: http://localhost:$${PORT_FRONTEND:-5173}   Backend: http://localhost:$${PORT_BACKEND:-8080}"

prod:
	docker compose --project-name $(PROJ_PROD) --env-file $(ENV) $(COMPOSE_PROD) up -d --build
	@echo "✓ Frontend: http://localhost:$${PORT_FRONTEND:-80}   Backend: http://localhost:$${PORT_BACKEND:-8080}"

dev-down:
	docker compose --project-name $(PROJ_DEV) --env-file $(ENV) $(COMPOSE_DEV) down

prod-down:
	docker compose --project-name $(PROJ_PROD) --env-file $(ENV) $(COMPOSE_PROD) down

dev-logs:
	docker compose --project-name $(PROJ_DEV) --env-file $(ENV) $(COMPOSE_DEV) logs -f --tail=100

prod-logs:
	docker compose --project-name $(PROJ_PROD) --env-file $(ENV) $(COMPOSE_PROD) logs -f --tail=100

dev-build:
	docker compose --project-name $(PROJ_DEV) --env-file $(ENV) $(COMPOSE_DEV) build --no-cache

prod-build:
	docker compose --project-name $(PROJ_PROD) --env-file $(ENV) $(COMPOSE_PROD) build --no-cache



ansible-dev:
	ansible-playbook ansible/playbook.yml -l localhost -e "env=dev"

ansible-prod:
	ansible-playbook ansible/playbook.yml -l localhost -e "env=prod"

ansible-deploy:
	ansible-playbook ansible/playbook.yml -l prod_servers -e "env=deploy"

ansible-rebuild-deploy:
	ansible-playbook ansible/playbook.yml -l prod_servers -e "env=deploy rebuild=true"

ansible-rebuild-dev:
	ansible-playbook ansible/playbook.yml -l localhost -e "env=dev rebuild=true"

ansible-stop-dev:
	ansible-playbook ansible/stop.yml -l localhost -e "env=dev"

ansible-stop-prod:
	ansible-playbook ansible/stop.yml -l localhost -e "env=prod"

ansible-stop-deploy:
	ansible-playbook ansible/stop.yml -l prod_servers -e "env=deploy"


clean: dev-down prod-down
	@echo "Все контейнеры остановлены"
