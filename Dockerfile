# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) from the API directory
COPY API/package*.json ./

# Install app dependencies
RUN npm install

# Copy the API code
COPY API/. .

# Copy the Frontend code into a 'Frontend' directory inside the working directory
COPY Frontend ./Frontend

# Expose port 3000 to the host
EXPOSE 3000

# Start the Node.js server
CMD [ "node", "server.js" ]
