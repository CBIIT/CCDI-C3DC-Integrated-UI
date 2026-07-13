FROM node:16.20.1-alpine AS build
RUN apk update && apk upgrade --no-cache openssl busybox


WORKDIR /usr/src/app

COPY . .
RUN npm cache clean --force

RUN NODE_OPTIONS="--max-old-space-size=4096" npm set progress=false
RUN NODE_OPTIONS="--max-old-space-size=4096" npm ci --legacy-peer-deps
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build --silent

# FROM nginx:1.23.3-alpine
#FROM nginx:1.25.5
FROM nginx:1.29.8-alpine-slim AS fnl_base_image
RUN apk add --no-cache ca-certificates && update-ca-certificates
RUN apk update && apk add --no-cache --upgrade \
	'musl>=1.2.5-r3' \
	'zlib>=1.3.2-r0' \
	'openssl>=3.3.7-r0' \
	'busybox>=1.36.1-r31'

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY --from=build /usr/src/app/config/inject.template.js /usr/share/nginx/html/inject.template.js
COPY --from=build /usr/src/app/config/nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /usr/src/app/config/entrypoint.sh /

ENV PORT 80

ENV HOST 0.0.0.0

RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

EXPOSE 80

ENTRYPOINT [ "sh", "/entrypoint.sh" ]
