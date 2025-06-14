FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite's default port
EXPOSE 8080

# Ensure Vite listens on all interfaces
ENV HOST=0.0.0.0

# Start the dev server
CMD ["npm", "run", "dev"]
