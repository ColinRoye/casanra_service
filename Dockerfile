FROM node:11
WORKDIR /app
COPY . /app
COPY wait-for-it.sh /app
RUN chmod +x wait-for-it.sh
RUN npm install
CMD ./wait-for-it.sh cassandra:9042 -t 0 --strict &&  node server.js
EXPOSE 3000
