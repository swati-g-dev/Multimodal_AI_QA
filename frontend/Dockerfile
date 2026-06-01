FROM node:22.15.0-alpine AS build

WORKDIR /app

COPY package*.json ./
# COPY package.json package-lock.json ./

# RUN npm ci

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# 80 is for nginx
EXPOSE 80

# EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]

# CMD ["npm", "run", "dev", "--", "--host"]