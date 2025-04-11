
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Make the run script executable
RUN chmod +x run.sh

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["./run.sh"]
