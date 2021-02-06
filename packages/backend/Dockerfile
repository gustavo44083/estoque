# Step 1: build
FROM node:12 AS builder

ENV NODE_ENV build

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app/

WORKDIR /home/app
COPY . /home/app
RUN npm run build


# Step 2: run
FROM node:12

ENV NODE_ENV production

WORKDIR /home/app
COPY --from=builder /home/app/package.json /home/app/
COPY --from=builder /home/app/node_modules /home/app/node_modules
COPY --from=builder /home/app/build /home/app/build

ENV PORT 3000
EXPOSE 3000

CMD npm run start:prod
