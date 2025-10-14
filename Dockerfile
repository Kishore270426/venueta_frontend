# Stage 1: Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite build (produces 'dist' folder)
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy the 'dist' folder instead of 'build'
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
