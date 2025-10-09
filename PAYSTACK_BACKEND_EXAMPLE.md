# PayStack Backend Integration Example

## ⚠️ Important Security Notice

The current implementation includes API calls in the frontend for demonstration purposes. **In production, you should NEVER expose your PayStack secret key in frontend code.**

## Recommended Backend Implementation

### 1. Create Backend Endpoints

Create these endpoints in your backend (Node.js/Express example):

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize Transaction
app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const { email, amount, currency, reference, channels, metadata } = req.body;
    
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount.toString(),
        currency: currency || 'GHS',
        reference,
        channels: channels || ['mobile_money'],
        metadata: JSON.stringify(metadata)
      },
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('PayStack initialization error:', error.response?.data || error.message);
    res.status(400).json({ 
      success: false, 
      error: error.response?.data?.message || 'Payment initialization failed' 
    });
  }
});

// Verify Transaction
app.get('/api/paystack/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('PayStack verification error:', error.response?.data || error.message);
    res.status(400).json({ 
      success: false, 
      error: error.response?.data?.message || 'Payment verification failed' 
    });
  }
});

// List Transactions
app.get('/api/paystack/transactions', async (req, res) => {
  try {
    const queryParams = new URLSearchParams(req.query);
    
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction?${queryParams}`,
      {
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('PayStack list transactions error:', error.response?.data || error.message);
    res.status(400).json({ 
      success: false, 
      error: error.response?.data?.message || 'Failed to fetch transactions' 
    });
  }
});

app.listen(3001, () => {
  console.log('PayStack proxy server running on port 3001');
});
```

### 2. Update Frontend Service

Update `src/services/paystackService.js` to use your backend:

```javascript
// Replace the direct API calls with backend calls
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const initializeTransaction = async (config) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/paystack/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to initialize transaction');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Initialize transaction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const verifyTransaction = async (reference) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/paystack/verify/${reference}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify transaction');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data,
      message: data.message
    };
  } catch (error) {
    console.error('Verify transaction error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
```

### 3. Environment Variables

#### Backend (.env)
```
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

#### Frontend (.env)
```
VITE_BACKEND_URL=http://localhost:3001
# Remove VITE_PAYSTACK_SECRET_KEY - never expose secret keys in frontend!
```

### 4. Webhook Handling

Add webhook endpoint to handle PayStack notifications:

```javascript
// Webhook endpoint
app.post('/api/paystack/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(req.body).digest('hex');
  
  if (hash === req.headers['x-paystack-signature']) {
    const event = JSON.parse(req.body);
    
    switch(event.event) {
      case 'charge.success':
        // Handle successful payment
        console.log('Payment successful:', event.data);
        // Update your database, send confirmation emails, etc.
        break;
        
      case 'charge.failed':
        // Handle failed payment
        console.log('Payment failed:', event.data);
        break;
        
      default:
        console.log('Unhandled event:', event.event);
    }
  }
  
  res.sendStatus(200);
});
```

## Mobile Money Integration Notes

### Ghana Mobile Money Providers
- **MTN Mobile Money**: Most popular in Ghana
- **Vodafone Cash**: Second largest provider
- **AirtelTigo Money**: Merged network provider

### Phone Number Format
- Ghana country code: +233
- Example: +233241234567
- Validation regex: `/^\\+?233[0-9]{9}$/`

### Testing
PayStack provides test phone numbers for mobile money testing:
- MTN: +233241234567
- Vodafone: +233501234567
- AirtelTigo: +233271234567

## Production Checklist

- [ ] Move all PayStack API calls to backend
- [ ] Remove secret key from frontend environment
- [ ] Set up webhook endpoint
- [ ] Configure proper CORS settings
- [ ] Add rate limiting to API endpoints
- [ ] Implement proper error logging
- [ ] Set up monitoring for payment failures
- [ ] Test with real mobile money accounts
- [ ] Configure production PayStack keys

## Security Best Practices

1. **Never expose secret keys in frontend code**
2. **Validate all inputs on backend**
3. **Use HTTPS in production**
4. **Implement proper authentication**
5. **Log all payment transactions**
6. **Set up fraud monitoring**
7. **Use PayStack webhooks for reliable payment status updates**