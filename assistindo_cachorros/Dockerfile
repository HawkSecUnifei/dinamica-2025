# Use the official Node.js image as the base image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000

ENV PORT=3000
ENV FLAG="hawk{c0m0_c4ch0rr0s_3_g4t0s}"

# Start the application
CMD ["npm", "start"]
