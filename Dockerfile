# 1. Base Image: Use a Node.js image
FROM node:lts-slim

# 2. Install Google Chrome Stable (The browser needed by whatsapp-web.js)
# This step is complex but necessary to get the browser running on Linux
RUN apt-get update && apt-get install -y wget gnupg ca-certificates \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Setup Project Directory and Copy Files
WORKDIR /usr/src/app
COPY package*.json ./

# 4. Install Node dependencies
RUN npm install

# 5. Copy the rest of the source code
COPY . .

# 6. Expose the port (Render will use this)
EXPOSE 7300

# 7.