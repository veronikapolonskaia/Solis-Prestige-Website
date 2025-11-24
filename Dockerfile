###############################
#   1) Build Travel Frontend
###############################
FROM node:20 AS travel-build
WORKDIR /app/travel
COPY travel-frontend/package*.json ./
RUN npm install
COPY travel-frontend ./
RUN npm run build

###############################
#   2) Build Admin Dashboard
###############################
FROM node:20 AS admin-build
WORKDIR /app/admin
COPY admin-dashboard/package*.json ./
RUN npm install
COPY admin-dashboard ./
RUN npm run build

###############################
#   3) Install API Dependencies
###############################
FROM node:20 AS api-build
WORKDIR /app/api
COPY server/package*.json ./
RUN npm install
COPY server ./

###############################
#   4) Production Container
###############################
FROM nginx:1.25

# Copy Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy frontend builds
COPY --from=travel-build /app/travel/dist /var/www/travel
COPY --from=admin-build /app/admin/build /var/www/admin

# Copy API code
COPY --from=api-build /app/api /var/www/api

# Install Node inside NGINX container
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    npm install -g pm2

WORKDIR /var/www/api

# Install API production dependencies
RUN npm install --omit=dev

EXPOSE 80

CMD ["pm2-runtime", "server.js"]
