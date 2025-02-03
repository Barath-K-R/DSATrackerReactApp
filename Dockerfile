# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps --silent
COPY . .
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
RUN apk add --no-cache gettext
CMD ["sh", "-c", "envsubst '${REACT_APP_SERVER_BASE_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]