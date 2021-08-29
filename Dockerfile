FROM node:alpine

WORKDIR /home/node/app
COPY package*.json ./
COPY . .
# EVN NODE_ENV=development
# ENV NODE_PATH=./build
RUN yarn add prisma -g

EXPOSE 3000
CMD ["sh", "-c", "yarn vercel-build ; yarn prisma db push; yarn start"]
