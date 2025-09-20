# Use official Node.js image
FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend source code
COPY . .

# Cloud Run sets PORT automatically
ENV PORT 8080

# Start server
CMD ["node", "server.js"]
