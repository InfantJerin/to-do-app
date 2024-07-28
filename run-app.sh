#!/bin/bash

# Build the Docker image
docker build -t task-manager-app .

# Run the Docker container
docker run -p 8000:8000 -p 3000:3000 task-manager-app