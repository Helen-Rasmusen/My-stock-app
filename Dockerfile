FROM node:lts-alpine

# Set environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production --silent

# Copy application code
COPY . .

# Expose application port
EXPOSE 8080

# Set permissions for the node user
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Start the application
CMD ["node", "index.js"]
