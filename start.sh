#!/bin/bash

# Start MongoDB
mongod --fork --logpath /var/log/mongodb.log

# Start the backend
cd /app/backend
python main.py &

# Start the frontend
cd /app/frontend
npx serve -s build -l 3000

# Keep the container running
tail -f /dev/null