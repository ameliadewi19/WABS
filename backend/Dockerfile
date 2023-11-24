FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon && npm install

COPY . ./

EXPOSE 5005

# Add a custom npm script to run migrations before starting the application
CMD ["sh", "-c", "npx sequelize db:create --env development || true && npx sequelize db:migrate --env development && nodemon start"]