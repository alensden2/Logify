# Base image
FROM node:14

# Setting the working directory inside the container
WORKDIR /app

# Copying package.json and package-lock.json to the working directory
COPY package*.json ./

# Installing dependencies
RUN npm install

# Copying the source code to the working directory
COPY . .

# Command to start the application
CMD ["npm", "start"]
