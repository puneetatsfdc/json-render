This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

### Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following variables:

```bash
# Required: AI Gateway API Key
# Get your API key from https://ai-sdk.dev
AI_GATEWAY_API_KEY=your_api_key_here

# Optional: Override the default model
# Default: anthropic/claude-opus-4.1
AI_GATEWAY_MODEL=anthropic/claude-opus-4.1

# Optional: Rate Limiting (Upstash Redis)
# If not provided, rate limiting will be disabled
KV_REST_API_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_redis_token
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_DAY=100
```

**Note:** The `AI_GATEWAY_API_KEY` is required for the app to function. Without it, you'll get an authentication error when trying to generate UI.

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
