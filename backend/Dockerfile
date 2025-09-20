FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend code
COPY . .

# Cloud Run sets the port
ENV PORT 8080

CMD ["node", "server.js"]
