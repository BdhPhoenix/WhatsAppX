# ... (Previous code for FROM and RUN apt-get install) ...

# 3. Setup Project Directory and Copy Files
WORKDIR /usr/src/app

# CRITICAL FIX: Copy the files *from* the Server/ folder 
# into the Docker working directory
COPY Server/package*.json ./

# 4. Install Node dependencies
RUN npm install

# 5. Copy the rest of the source code (including chat.ts, server.ts, etc.)
COPY Server/. .

# 6. Expose the port (Render will use this)
EXPOSE 7300

# 7. Start the server (using the npm start script)
CMD [ "npm", "start" ]
