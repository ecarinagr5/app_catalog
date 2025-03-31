# Use a RHEL-based Node.js 18 image
FROM esazucr0asq01.azurecr.io/goldenimages/giattrhel8-nodejs-18:202410041944

# Switch to root user to install Yarn
USER root

# Install Node.js 20 and Yarn
RUN yum remove -y nodejs && \
    yum module reset nodejs -y && \
    yum module enable nodejs:20 -y && \
    yum install -y nodejs

# Verify installation
RUN node -v && npm -v

# Set the working directory inside the container
WORKDIR /app

# Change ownership of the /app directory to the non-root user (1001)
RUN mkdir -p /src/.next && chmod -R 777 /src/.next && chown -R 1001:0 /src

# Switch back to the non-root user
USER 1001

# Set the working directory inside the container
WORKDIR /src

# Copy package.json leverage Docker cache
COPY package.json ./

# Copy the rest of your application code
COPY . .

# Build your application
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
