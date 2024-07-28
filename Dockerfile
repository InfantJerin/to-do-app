# Use an official Python runtime as a parent image for the backend
FROM python:3.9-slim AS backend

# Set the working directory in the container
WORKDIR /app/backend

# Copy the backend dependencies file to the working directory
COPY backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY backend/ .

# Use an official Node runtime as a parent image for the frontend
FROM node:14 AS frontend

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ .

# Build the React app
RUN npm run build

# Use a lightweight base image for the final stage
FROM python:3.9-slim

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

# Set the working directory in the container
WORKDIR /app

# Copy backend from the backend stage
COPY --from=backend /app/backend /app/backend

# Copy frontend build from the frontend stage
COPY --from=frontend /app/frontend/build /app/frontend/build

# Install MongoDB
RUN apt-get update && apt-get install -y mongodb

# Create directory for MongoDB data
RUN mkdir -p /data/db

# Copy the startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Make port 3000 available for the frontend
EXPOSE 3000

# Run the startup script when the container launches
CMD ["/app/start.sh"]