FROM node:22

COPY package*.json ./
RUN npm install

COPY . .

# Add wait-for-it utility to wait the server until the database is up
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 5000

CMD ["./start.bash"]
