# Use a suitable Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your application listens on
EXPOSE 8080

# Command to run the application when the container starts
CMD ["node", "unreal.js"]