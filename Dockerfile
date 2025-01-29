FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps --silent

COPY . .

RUN npm run build

FROM nginx:1.25-alpine

WORKDIR /user/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/build .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
