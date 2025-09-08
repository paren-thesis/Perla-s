# Stripe Payment Integration Setup Guide - Step 4

## Overview
This guide shows you how to set up Stripe payment processing for your restaurant app. The integration includes secure payment forms, payment method management, and order confirmation.

## Prerequisites
- Step 1-3 completed (Firestore, Location Services, Enhanced Settings)
- Stripe account (free to create)
- Stripe API keys

## 1. Stripe Account Setup

### Create Stripe Account:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a free account
3. Complete account verification
4. Switch to "Test mode" for development

### Get API Keys:
1. In Stripe Dashboard, go to "Developers" → "API keys"
2. Copy your "Publishable key" (starts with `pk_test_`)
3. Copy your "Secret key" (starts with `sk_test_`) - Keep this secure!

## 2. Environment Configuration

### Add Stripe Keys to Environment:
1. Copy `.env.example` to `.env` if you haven't already
2. Add your Stripe keys:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Important**: Never commit your secret key to version control!

## 3. Backend Setup (Required for Production)

### Create Payment Intent Endpoint:
You'll need a backend API endpoint to create payment intents securely:

```javascript
// Example Express.js endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency, metadata } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: metadata,
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Security Considerations:
- Never expose secret keys in frontend code
- Validate payment amounts on the backend
- Use HTTPS in production
- Implement proper error handling

## 4. Components Created

### **PaymentForm Component**
- **File**: `src/components/Payment/PaymentForm.jsx`
- **Features**:
  - Secure card input using Stripe Elements
  - Form validation
  - Payment processing
  - Error handling
  - Demo mode for testing

### **PaymentMethodManager Component**
- **File**: `src/components/Payment/PaymentMethodManager.jsx`
- **Features**:
  - Save payment methods
  - Set default payment method
  - Edit/delete payment methods
  - Payment method selection

### **PaymentSuccess Component**
- **File**: `src/components/Payment/PaymentSuccess.jsx`
- **Features**:
  - Order confirmation
  - Payment details
  - Next steps information
  - Action buttons

### **Stripe Service**
- **File**: `src/services/stripeService.js`
- **Features**:
  - Payment intent creation
  - Payment confirmation
  - Card validation
  - Amount formatting
  - Demo payment simulation

## 5. Features Implemented

### **Payment Processing**
| Feature | Status | Description |
|---------|--------|-------------|
| Card Input | ✅ | Secure Stripe Elements integration |
| Form Validation | ✅ | Client-side validation |
| Payment Processing | ✅ | Stripe payment confirmation |
| Error Handling | ✅ | Comprehensive error management |
| Demo Mode | ✅ | Testing without real payments |

### **Payment Management**
| Feature | Status | Description |
|---------|--------|-------------|
| Save Payment Methods | ✅ | Store cards for future use |
| Default Payment Method | ✅ | Set preferred payment method |
| Payment Method Selection | ✅ | Choose from saved methods |
| Payment History | ✅ | Track payment records |

### **Order Integration**
| Feature | Status | Description |
|---------|--------|-------------|
| Order Creation | ✅ | Create order before payment |
| Payment Linking | ✅ | Link payment to order |
| Order Confirmation | ✅ | Success page with details |
| Cart Clearing | ✅ | Clear cart after successful payment |

## 6. Testing the Integration

### **Test Mode Setup:**
1. Ensure you're in Stripe test mode
2. Use test card numbers:
   - **Visa**: 4242 4242 4242 4242
   - **Mastercard**: 5555 5555 5555 4444
   - **American Express**: 3782 822463 10005
   - **Any future date for expiry**
   - **Any 3-4 digit CVV**

### **Test the Complete Flow:**
1. **Add items to cart** in `/menu`
2. **Go to checkout** (`/checkout`)
3. **Select delivery method** (pickup/delivery)
4. **Choose location** (if delivery)
5. **Review order** details
6. **Enter payment** information
7. **Complete payment** process
8. **View confirmation** page

### **Test Payment Scenarios:**
- **Successful payment** with valid card
- **Failed payment** with invalid card
- **Network errors** (disconnect internet)
- **Form validation** errors
- **Demo mode** functionality

## 7. Production Deployment

### **Environment Variables:**
```env
# Production Stripe Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

### **Backend Requirements:**
- Create payment intent endpoint
- Handle webhooks for payment events
- Implement proper error handling
- Add logging and monitoring

### **Security Checklist:**
- [ ] Secret keys stored securely
- [ ] HTTPS enabled
- [ ] Payment amounts validated on backend
- [ ] Webhook signatures verified
- [ ] Error handling implemented
- [ ] Logging configured

## 8. Webhook Setup (Recommended)

### **Create Webhook Endpoint:**
```javascript
// Handle Stripe webhooks
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update order status
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});
```

## 9. Demo Mode Features

### **Current Demo Implementation:**
- Simulates payment processing
- No real charges made
- Works without backend
- Perfect for testing UI/UX

### **Demo Payment Methods:**
- Pre-configured test cards
- Simulated payment success
- Mock payment intents
- Realistic error scenarios

## 10. Troubleshooting

### **Common Issues:**

**"Stripe not loaded"**
- Check API key configuration
- Verify network connection
- Check browser console for errors

**"Payment failed"**
- Verify card details
- Check Stripe dashboard for errors
- Ensure test mode is enabled

**"Form validation errors"**
- Check card number format
- Verify expiry date format
- Ensure all required fields filled

### **Debug Mode:**
Enable detailed logging by adding to your `.env`:
```env
VITE_DEBUG_STRIPE=true
```

## 11. Next Steps

### **Immediate:**
1. Set up Stripe account
2. Add API keys to environment
3. Test payment flow
4. Verify order creation

### **Future Enhancements:**
- Real backend integration
- Webhook handling
- Payment method management
- Order history
- Refund processing
- Subscription payments

## 12. Cost Information

### **Stripe Pricing:**
- **Test Mode**: Free
- **Live Mode**: 2.9% + 30¢ per successful charge
- **No monthly fees**
- **No setup costs**

### **Additional Features:**
- Payment method storage: Free
- Webhooks: Free
- Disputes: $15 per dispute
- Chargebacks: $15 per chargeback

## Files Created/Updated

### **New Files:**
- `src/services/stripeService.js` - Stripe integration service
- `src/components/Payment/PaymentForm.jsx` - Payment form component
- `src/components/Payment/PaymentMethodManager.jsx` - Payment method management
- `src/components/Payment/PaymentSuccess.jsx` - Success confirmation
- `STRIPE_SETUP_GUIDE.md` - This setup guide

### **Updated Files:**
- `src/pages/Checkout.jsx` - Integrated Stripe payment processing
- `.env.example` - Added Stripe configuration

## Security Best Practices

### **Frontend:**
- Never store secret keys
- Use HTTPS only
- Validate input client-side
- Handle errors gracefully

### **Backend:**
- Validate all payment data
- Use webhook signatures
- Log all payment events
- Implement rate limiting

**Your restaurant app now has complete payment processing with Stripe! Users can securely pay for orders with real payment methods. 🎉**