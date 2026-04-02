

## Problem Analysis

Two issues identified:

1. **Share buttons on ItemDetail page may fail** — `navigator.clipboard.writeText()` can fail in iframe/insecure contexts without proper error handling. The WhatsApp share should work but the copy button silently fails.

2. **Shared links require authentication** — When someone opens a shared `/item/{id}` link, the item detail page itself loads fine (route is public), BUT the item navigation from homepage uses `requireAuth()` wrappers (in FeaturedItems, PopularItems, HomemadeOrder, Menu), meaning unauthenticated users can't even navigate to items to test sharing.

## Plan

### 1. Fix clipboard copy with fallback
In `src/pages/ItemDetail.tsx`, wrap `navigator.clipboard.writeText()` in a try-catch and add a fallback using `document.execCommand('copy')` for environments where the Clipboard API isn't available. Show error toast on failure instead of silently failing.

### 2. Make item viewing accessible without login
In `src/components/customer/FeaturedItems.tsx`, `src/components/customer/PopularItems.tsx`, `src/pages/HomemadeOrder.tsx`, and `src/pages/Menu.tsx` — allow navigation to `/item/{id}` without requiring auth. The auth check should happen only when adding to cart or buying, not when viewing. This ensures shared links work for everyone.

### 3. Add Web Share API support
Enhance the share button to use `navigator.share()` (native share dialog) when available, falling back to WhatsApp link. This provides a better mobile experience with native share sheets.

### Technical Details
- **Files modified**: `ItemDetail.tsx`, `FeaturedItems.tsx`, `PopularItems.tsx`, `HomemadeOrder.tsx`, `Menu.tsx`
- The `requireAuth` guard will be moved from item navigation to cart/buy actions in ItemDetail (which already has auth checks in `handleBuyNow`)

