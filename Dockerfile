FROM node:20-alpine as build
RUN apk upgrade --no-cache && \
apk add --no-cache zip

WORKDIR /app
COPY . /app


EXPOSE 3000

## Until I can work through the pyodide build issues ...
RUN npm install 
CMD ["npm", "start"]


# RUN npm install && npm run build


# FROM nginx:mainline-alpine
# RUN apk upgrade --no-cache

# COPY --from=build /app/dist /usr/share/nginx/html
