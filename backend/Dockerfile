FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g nodemon sequelize-cli && npm install

COPY . .

EXPOSE 5005

# Add a custom npm script to run migrations before starting the application
CMD ["nodemon", "start"]