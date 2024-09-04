# Use the official Node.js image.
FROM node:18

# Set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

COPY . .

EXPOSE 8083

# Command to run your app.
CMD ["npm", "start"]
