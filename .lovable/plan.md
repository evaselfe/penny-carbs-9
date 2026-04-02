

## Fix: Delivery Rules Dialog Scrollbar Not Working Properly

**Problem**: The vertical scrollbar in the "Add/Edit Rule" dialog may not be visually appearing or functioning correctly. There's also a React warning about refs on the Select component inside ScrollArea.

**Root Cause**: The Radix ScrollArea can have issues when the content doesn't overflow, or when nested Radix components (like Select portals) interfere. The `max-h-[60vh]` constraint may be sufficient for the current number of fields on larger screens, making the scrollbar invisible.

**Changes**:

### 1. `src/components/admin/delivery/DeliveryRulesTab.tsx`
- Reduce the scroll area max height from `max-h-[60vh]` to `max-h-[50vh]` so the scrollbar appears more reliably on smaller screens
- Add `overflow-y-auto` as a fallback styling approach
- Ensure the `DialogContent` has proper overflow constraints

### 2. Ensure proper scroll behavior
- Keep the header and submit button outside the ScrollArea (already done)
- Add padding at the bottom of the scrollable content to prevent the last field from being cut off

This is a minor CSS adjustment to ensure the scrollbar is visible and functional across different screen sizes.

