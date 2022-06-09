FROM node:14
WORKDIR /app
COPY . .
RUN npm install -g typescript
COPY tsconfig.json .
RUN tsc --build
COPY packages*.json ./build
RUN cd build
RUN npm install
CMD ["node", "app.js"]
EXPOSE 8080