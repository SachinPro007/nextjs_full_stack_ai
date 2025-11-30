# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./ 
RUN npm ci

# 2. Rebuild the source code
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# PUBLIC keys, these keys are required for build the app
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGFybWxlc3MtcXVhZ2dhLTk4LmNsZXJrLmFjY291bnRzLmRldiQ
ENV NEXT_PUBLIC_CONVEX_URL=https://brave-akita-339.convex.cloud
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/


# Build the Next.js application
RUN npm run build


# 3. Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production


# Copy the built app from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static


EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]