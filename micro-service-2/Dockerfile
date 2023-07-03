# Base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Expose the port on which the application will run
EXPOSE 8081

# Command to start the application
CMD [ "node", "index.js" ]