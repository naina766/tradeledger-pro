# Stage 1: Build Dependencies
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma/ ./prisma/

RUN npm ci --only=production
RUN npx prisma generate

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY prisma/ ./prisma/
COPY src/ ./src/

RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
