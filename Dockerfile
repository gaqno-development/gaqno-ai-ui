FROM node:20-alpine AS base
RUN apk add --no-cache git libc6-compat

FROM base AS builder
WORKDIR /app

COPY package.json ./
COPY .npmrc* ./
ARG NPM_TOKEN
RUN if [ -z "$NPM_TOKEN" ] || [ "$NPM_TOKEN" = "REPLACE_WITH_GITHUB_PAT_IN_COOLIFY_UI" ]; then \
    echo "ERROR: NPM_TOKEN must be set in Coolify Build Arguments (GitHub PAT with read:packages)."; exit 1; \
    fi && \
    printf '%s\n' "@gaqno-development:registry=https://npm.pkg.github.com" "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc
RUN npm config set fetch-timeout 1200000 && \
    npm config set fetch-retries 10 && \
    npm cache clean --force 2>/dev/null; \
    npm install --legacy-peer-deps --include=dev

COPY . .
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { listen 3002; server_name _; root /usr/share/nginx/html; index index.html; absolute_redirect off; \
    location = /assets/remoteEntry.js { alias /usr/share/nginx/html/assets/remoteEntry.js; add_header Cache-Control "no-cache"; add_header Access-Control-Allow-Origin "*"; } \
    location = /ai/assets/remoteEntry.js { alias /usr/share/nginx/html/assets/remoteEntry.js; add_header Cache-Control "no-cache"; add_header Access-Control-Allow-Origin "*"; } \
    location /ai/assets/ { alias /usr/share/nginx/html/assets/; add_header Cache-Control "public, immutable"; add_header Access-Control-Allow-Origin "*"; } \
    location /assets/ { alias /usr/share/nginx/html/assets/; add_header Cache-Control "public, immutable"; add_header Access-Control-Allow-Origin "*"; } \
    location / { return 302 /; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
