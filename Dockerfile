# --- ETAPA 1: Construcción (Build) ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos los archivos de dependencias primero (para aprovechar la caché)
COPY package.json package-lock.json ./
RUN npm install

# Copiamos el resto del código
COPY . .

# Construimos la aplicación (Genera la carpeta /dist)
RUN npm run build

# --- ETAPA 2: Servidor Estático (Production) ---
FROM nginx:alpine

# Copiamos los archivos generados en la etapa anterior a la carpeta de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiamos una configuración básica de Nginx (opcional, pero recomendada para React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]