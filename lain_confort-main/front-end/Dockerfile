# Stage 1: Build Angular app
FROM node:18-bullseye AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:1.26-alpine

# Remove default Nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output from Stage 1
COPY --from=build /app/dist/front-end/ /usr/share/nginx/html/

# Copy custom Nginx config (make sure it exists)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
