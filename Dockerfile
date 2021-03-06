# ************
# BUILD STAGE
# ************

# Node is our build image. It comes with node, npm, and yarn.
FROM node:10-alpine as build-deps
WORKDIR /usr/src/app

# Install dependencies
#   This method separate the dependency installation from the edits to our 
#   source files. This allows Docker to cache these steps so that subsequent 
#   builds — one’s in which we only edit source files and don’t install any 
#   new dependencies — will be faster.
COPY package.json package-lock.json ./
RUN npm install 

# Copy all sources files to the working dir and compile the app
COPY . ./
RUN npm run build

# ************
# SERVE STAGE
# ************

# Nginx is our server image. It will host the html and compiled assets.
FROM nginx:1.15.6-alpine

# Copy the compiled app file from the build stage to the nginx web root.
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html

# Define the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Allow HTTP requests on port 80.
EXPOSE 80

# Start hosting the compiled assets.
CMD ["nginx", "-g", "daemon off;"]