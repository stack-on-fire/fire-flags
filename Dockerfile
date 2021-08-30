FROM node:alpine

WORKDIR /home/node/app
COPY package*.json ./
COPY . .
RUN yarn add prisma -g

EXPOSE 3000
CMD ["sh", "-c", "yarn vercel-build ; yarn start"]
