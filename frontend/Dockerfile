FROM node:20-alpine AS builder

ARG VITE_DOMAIN=localhost
ARG VITE_SESSION_LIFETIME_DAYS=2
ARG VITE_API_URL=/api/v1

ENV VITE_DOMAIN=$VITE_DOMAIN
ENV VITE_SESSION_LIFETIME_DAYS=$VITE_SESSION_LIFETIME_DAYS
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=builder /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
