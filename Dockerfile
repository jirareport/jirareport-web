FROM node:10.15.3 as builder

COPY . /jirareport-web
WORKDIR /jirareport-web

ENV REACT_APP_API_URL="/jirareport-api/"

RUN npm install
RUN npm run build

###

FROM nginx:latest
EXPOSE 80

COPY --from=builder /jirareport-web/build/ /usr/share/nginx/html/
ADD nginx.conf.template /usr/src/nginx.conf.template

ENV DOLLAR="$"

CMD /bin/bash -c "envsubst < /usr/src/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
