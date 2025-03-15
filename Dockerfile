# Use the Node.js base image
FROM node:12-alpine

# Install necessary tools for development and native modules
RUN apk add --no-cache make g++ python2 build-base bash && ln -sf /usr/bin/python2 /usr/bin/python

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first for dependency installation (leverage Docker layer caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Expose port for development (if necessary)
EXPOSE 3000

# Start the container and wait for user input in an interactive shell
CMD ["/bin/bash"]
