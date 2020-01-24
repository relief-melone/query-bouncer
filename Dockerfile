FROM node:12-alpine

WORKDIR /app
COPY . .

RUN npm config set proxy $HTTP_PROXY && \
    npm config set https-proxy $HTTPS_PROXY && \
    npm --version && node --version

RUN npm install
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]