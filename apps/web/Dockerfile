# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app/frontend

# Copy only package files and install dependencies to leverage caching
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ .

# Build the application
RUN npm run build

# Stage 2: Production Server
FROM nginx:stable-alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY frontend/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]