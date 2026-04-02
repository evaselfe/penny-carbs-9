

## Problem

The screenshot shows a **404: NOT_FOUND** error on the Vercel-deployed site (`penny-carbs.vercel.app`) when accessing a direct URL like `/item/:id`. This is a classic SPA routing issue -- Vercel doesn't know to serve `index.html` for client-side routes, so it returns a 404.

The share buttons in the app work correctly (copy link, Web Share API), but when the recipient opens the link, Vercel can't find a matching file and returns 404.

## Solution

Add a `vercel.json` file to the project root with a catch-all rewrite rule that directs all routes to `index.html`, allowing React Router to handle them client-side.

### File to create: `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This is a single-file change. No other modifications needed.

