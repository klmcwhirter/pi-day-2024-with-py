#*----------------------------------------------------------------------
#* pythonbuild
#*----------------------------------------------------------------------

FROM python:3.12-alpine as pythonbuild
ARG ENABLE_TESTS
WORKDIR /app
COPY . /app

RUN apk upgrade --no-cache && \
apk add --no-cache zip && \
ENABLE_TESTS=$ENABLE_TESTS ./etc/gen_run_pytests.sh

#*----------------------------------------------------------------------
#* zigbuild
#*----------------------------------------------------------------------
FROM alpine as zigbuild
ARG ENABLE_TESTS
WORKDIR /app
COPY ./etc /app/etc
COPY pi-zig /app
COPY --from=pythonbuild /app/pi-zig/src/pi_30000.zig src/pi_30000.zig

RUN ZIGVER=0.11.0 && ZIGARCH=zig-linux-x86_64-$ZIGVER.tar.xz && ZIGBIN=zig-bin && \
apk upgrade --no-cache && \
apk add --no-cache zip && \
wget -O $ZIGARCH https://ziglang.org/download/$ZIGVER/$ZIGARCH && \
tar xf $ZIGARCH && \
ENABLE_TESTS=$ENABLE_TESTS ZIGARCH=$ZIGARCH ZIGBIN=$ZIGBIN ./etc/build_run_zig_tests.sh

#*----------------------------------------------------------------------
#* build
#*----------------------------------------------------------------------

FROM node:20-alpine as build

RUN apk upgrade --no-cache && \
apk add --no-cache unzip

# ENV TZ=PST8PDT set in docker-compose.yml

WORKDIR /app
COPY . /app
COPY --from=zigbuild /app/zig-build* .
COPY --from=zigbuild /app/zig-tests* .
# used for integration testing pi-zig.wasm: execute `node public/pi-zig.js` in the container
COPY --from=zigbuild /app/src/pi-zig.js ./public/pi-zig.js
COPY --from=zigbuild /app/zig-out/lib/pi-zig.wasm ./public/pi-zig.wasm

COPY --from=pythonbuild /app/piadapter.zip .
COPY --from=pythonbuild /app/python-tests.* .

RUN npm install && \
etc/clean_final.sh && \
rm -fr etc/

## Until I can work through the pyodide build issues ...
EXPOSE 3000
CMD ["npm", "start"]


# RUN npm install && npm run build


#*----------------------------------------------------------------------
#* final
#*----------------------------------------------------------------------

# FROM nginx:mainline-alpine
# RUN apk upgrade --no-cache

# COPY --from=build /app/dist /usr/share/nginx/html
