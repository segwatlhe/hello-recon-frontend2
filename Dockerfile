### STAGE 1: Build ###
FROM node:14.15-alpine AS build
ARG ENV="production"
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN echo ${ENV}
RUN npm run build-hg-recon-${ENV}
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/hellogrouprecon-frontend /usr/share/nginx/html
