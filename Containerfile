#*----------------------------------------------------------------------
#* pythontests
#*----------------------------------------------------------------------

FROM python:3.12-alpine as pythontests
ARG ENABLE_TESTS
WORKDIR /app
COPY . /app

RUN apk upgrade --no-cache && \
apk add --no-cache zip && \
ENABLE_TESTS=$ENABLE_TESTS ./etc/gen_run_pytests.sh

#*----------------------------------------------------------------------
#* build
#*----------------------------------------------------------------------

FROM node:20-alpine as build

RUN apk upgrade --no-cache && \
apk add --no-cache unzip

# ENV TZ=PST8PDT set in docker-compose.yml

WORKDIR /app
COPY . /app
COPY --from=pythontests /app/piadapter.zip .
COPY --from=pythontests /app/pythontests.* .

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
