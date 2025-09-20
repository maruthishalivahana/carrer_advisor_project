FROM node:18-alpine

# set working directory
WORKDIR /app

# install dependencies
COPY package*.json ./
RUN npm install --only=production

# copy rest of the code
COPY . .

# set environment variable for Cloud Run
ENV PORT=8080

# expose port
EXPOSE 8080

# start the app
CMD ["node", "index.js"]
