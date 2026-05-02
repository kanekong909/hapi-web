# ── Stage 1: Build Angular ────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build -- --configuration=production

# ── Stage 2: Nginx para servir ───────────────────────────
FROM nginx:alpine

# Copiar la config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de Angular — ajusta 'hapi-web' si cambiaste el nombre del proyecto
COPY --from=builder /app/dist/hapi-web/browser /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
