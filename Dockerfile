# 1. Base Image: Use a Node.js image
FROM node:lts-slim

# 2. Install Google Chrome Stable (The browser needed by whatsapp-web.js)
# ... (Keep the RUN apt-get install commands here) ...
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    libnss3 \
    libgconf-2-4 \
    libatk-bridge2.0-0 \
    libxrandr2 \
    libxdamage1 \
    libgbm-dev \
    libasound2 \
    libfontconfig \
    libxshmfence-dev \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Setup Project Directory and Copy Files
WORKDIR /usr/src/app

# CRITICAL FIX: Copy the files *from* the Server/ folder 
COPY Server/package*.json ./

# 4. Install Node dependencies
RUN npm install

# 5. Copy the rest of the source code
COPY Server/. .

# 6. Expose the port (Render will use this)
EXPOSE 7300

# 7. Start the server (using the npm start script)
CMD [ "npm", "start" ]




