FROM node:18.17.0-alpine3.18 AS builder
WORKDIR /app
COPY package*.json .
COPY tsconfig.json .
RUN npm install
COPY src/ ./src/
RUN npm run build

FROM node:18.17.0-alpine3.18
WORKDIR /app
COPY package*.json .
RUN mkdir data
RUN npm install
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]