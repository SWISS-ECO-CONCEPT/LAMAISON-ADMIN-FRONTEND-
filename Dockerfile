# ---------- Stage 1 : build ----------
    FROM node:20-slim AS build

    WORKDIR /app
    
    COPY package.json package-lock.json ./
    RUN npm install
    
    # Seule variable nécessaire ici : l'URL de l'API backend.
    # Contrairement au frontend public, cet admin n'utilise pas Clerk.
    ARG VITE_API_URL
    ENV VITE_API_URL=$VITE_API_URL
    
    COPY . .
    RUN npm run build
    
    # ---------- Stage 2 : image finale (serveur web) ----------
    FROM nginx:alpine
    
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]