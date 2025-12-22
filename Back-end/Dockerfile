# Multi-stage Dockerfile for NestJS + Prisma
# Build stage
FROM node:20-bookworm AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sources
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src ./src

# Generate Prisma client and build
RUN npm run prisma:generate
RUN npm run build

# Runtime stage
FROM node:20-bookworm AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy build output and prisma schema
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Generate Prisma client in runtime image to ensure correct engines
RUN npm run prisma:generate

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
