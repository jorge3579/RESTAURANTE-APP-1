FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY . .

RUN mkdir -p uploads logs && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["pnpm", "start"]
