# Install dependencies only when needed
FROM node:20-alpine AS deps

WORKDIR /app
COPY ./package.json ./
RUN yarn install

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY ./.eslintrc.js ./.eslintrc.js
COPY ./.prettierrc ./.prettierrc
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./nest-cli.json ./nest-cli.json
COPY ./libs ./libs
COPY ./apps/worker ./apps/worker

# Create Build command for Server
RUN yarn build worker

# Production image, copy all the files
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["yarn", "run", "start:prod-worker"]