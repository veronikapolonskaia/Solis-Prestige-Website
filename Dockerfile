FROM node:20

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY server/package*.json server/
COPY admin-dashboard/package*.json admin-dashboard/
COPY travel-frontend/package*.json travel-frontend/

RUN npm install \
 && cd server && npm install \
 && cd ../admin-dashboard && npm install \
 && cd ../travel-frontend && npm install

COPY . .

RUN chmod +x run-all.sh

EXPOSE 3000 5000 5173

CMD ["bash","run-all.sh"]

