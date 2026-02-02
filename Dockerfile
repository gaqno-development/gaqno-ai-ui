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
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-timeout 1200000 && \
    npm config set fetch-retries 10 && \
    npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM nginx:alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { listen 3002; server_name _; root /usr/share/nginx/html; index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
    location /assets { add_header Cache-Control "public, immutable"; add_header Access-Control-Allow-Origin "*"; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 3002
CMD ["nginx", "-g", "daemon off;"]
