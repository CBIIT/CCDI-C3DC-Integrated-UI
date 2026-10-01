FROM node:16.20.1-alpine AS build
RUN apk update && apk upgrade --no-cache openssl busybox


WORKDIR /usr/src/app

COPY . .
RUN npm cache clean --force

RUN NODE_OPTIONS="--max-old-space-size=4096" npm set progress=false
RUN NODE_OPTIONS="--max-old-space-size=4096" npm ci --legacy-peer-deps
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build --silent

FROM nginx:1.30.5-alpine3.24-slim AS fnl_base_image
RUN apk add --no-cache --upgrade ca-certificates 'busybox>=1.37.0-r31' \
	&& update-ca-certificates

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY --from=build /usr/src/app/config/inject.template.js /usr/share/nginx/html/inject.template.js
COPY --from=build /usr/src/app/config/nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /usr/src/app/config/entrypoint.sh /

ENV PORT=8080

ENV HOST=0.0.0.0

RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf" \
	&& sed -i '/^user /d' /etc/nginx/nginx.conf \
	&& chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /run

EXPOSE 8080

USER nginx

ENTRYPOINT [ "sh", "/entrypoint.sh" ]
