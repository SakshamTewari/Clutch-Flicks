# Stage 1: Builder stage
FROM node:18 AS builder

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

#Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the docker image
COPY . .

#Build the app
RUN npm run build

# Stage 2: Production stage
FROM node:18-slim

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit-dev

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the app using CMD (only one CMD allowed)
CMD ["npm", "run", "serve"]