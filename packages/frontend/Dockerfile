# Step 1: build
FROM node:12 AS builder

ENV NODE_ENV production

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /home/app && cp -a /tmp/node_modules /home/app/

WORKDIR /home/app
COPY . /home/app
RUN npm run build


# Step 2: run
FROM nginx:latest
COPY --from=builder /home/app/build /var/www
COPY --from=builder /home/app/.docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443
