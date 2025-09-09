# Content Security Policy (CSP) Configuration

## Overview
The Content Security Policy errors you're seeing are related to Stripe scripts trying to load. Since we've switched to Paystack, these errors should disappear.

## Current CSP Issues
The errors show that Stripe scripts are being blocked by CSP:
- `blob:https://js.stripe.com/...`
- `blob:https://m.stripe.network/...`

## Solution
Since we've removed Stripe and switched to Paystack, these errors should no longer occur. However, if you still see them, here's how to fix:

### 1. Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### 2. Restart Development Server
```bash
npm run dev
```

### 3. Check for Remaining Stripe Code
Make sure no Stripe imports remain in your code:
```bash
grep -r "stripe" src/
grep -r "Stripe" src/
```

## Paystack CSP Requirements
If you need to configure CSP for Paystack, add these to your CSP:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.paystack.co;
  frame-src 'self' https://js.paystack.co;
">
```

## Vite CSP Configuration
If using Vite, you can configure CSP in `vite.config.js`:

```javascript
export default {
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.paystack.co; frame-src 'self' https://js.paystack.co;"
    }
  }
}
```

## Testing
After making changes:
1. Clear browser cache
2. Restart development server
3. Test the payment flow
4. Check browser console for errors

The Stripe-related CSP errors should disappear once you clear the cache and restart the server.