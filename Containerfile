#*----------------------------------------------------------------------
#* pythonbuild
#*----------------------------------------------------------------------

FROM docker.io/library/python:3.12-alpine as pythonbuild
ARG ENABLE_TESTS
WORKDIR /app
COPY . /app

RUN apk upgrade --no-cache && \
apk add --no-cache zip && \
ENABLE_TESTS=$ENABLE_TESTS PI_DIGITS_FILE=/app/src/pi/pi_digits_seed.ts ./etc/gen_pi_digits.sh

#*----------------------------------------------------------------------
#* build
#*----------------------------------------------------------------------

FROM docker.io/library/node:20-alpine as build

RUN apk upgrade --no-cache && \
apk add --no-cache unzip

# ENV TZ=PST8PDT set in docker-compose.yml

WORKDIR /app
COPY . /app

COPY --from=pythonbuild /app/src/pi/pi_digits_seed.ts /app/src/pi/pi_digits_seed.ts
COPY --from=pythonbuild /app/python-*.* .

RUN npm install && \
npm test && \
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
