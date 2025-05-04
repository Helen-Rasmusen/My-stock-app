# Use the official Node.js image as a base image
FROM node:lts-alpine@sha256:1234567890abcdef

# Set the timezone to UTC
ENV TZ=UTC

# Set environment variable
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json ./
COPY package-lock.json ./     

# Optional: If it exists 
RUN npm install --production

# Copy application code
COPY . .

# Expose application port
EXPOSE 8080

# Set permissions for the node user
RUN chown -R node:node /usr/src/app || true

# Switch to non-root user
USER node

# Start the application
CMD ["node", "index.js"]
