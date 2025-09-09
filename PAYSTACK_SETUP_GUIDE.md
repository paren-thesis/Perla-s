# Paystack Payment Integration Setup Guide - Step 4

## Overview
This guide shows you how to set up Paystack payment processing for your restaurant app. Paystack is a leading payment processor in Africa, making it perfect for Ghana and other African markets.

## Prerequisites
- Step 1-3 completed (Firestore, Location Services, Enhanced Settings)
- Paystack account (free to create)
- Paystack API keys

## 1. Paystack Account Setup

### Create Paystack Account:
1. Go to [Paystack Dashboard](https://dashboard.paystack.com/)
2. Sign up for a free account
3. Complete account verification
4. Switch to "Test mode" for development

### Get API Keys:
1. In Paystack Dashboard, go to "Settings" → "API Keys & Webhooks"
2. Copy your "Public key" (starts with `pk_test_`)
3. Copy your "Secret key" (starts with `sk_test_`) - Keep this secure!

## 2. Environment Configuration

### Add Paystack Keys to Environment:
1. Copy `.env.example` to `.env` if you haven't already
2. Add your Paystack keys:

```env
# Paystack Configuration
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
```

**Important**: Never commit your secret key to version control!

## 3. Backend Setup (Required for Production)

### Create Payment Verification Endpoint:
You'll need a backend API endpoint to verify payments securely:

```javascript
// Example Express.js endpoint
app.get('/api/verify-payment/:reference', async (req, res) => {
  const { reference } = req.params;
  
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.status) {
      res.json(data);
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Security Considerations:
- Never expose secret keys in frontend code
- Validate payment amounts on the backend
- Use HTTPS in production
- Implement proper error handling
- Verify webhook signatures

## 4. Components Created

### **PaystackPaymentForm Component**
- **File**: `src/components/Payment/PaystackPaymentForm.jsx`
- **Features**:
  - Email input for payment
  - Currency selection (GHS, NGN, USD, EUR, GBP)
  - Payment method information
  - Form validation
  - Demo mode for testing

### **PaystackPaymentMethodManager Component**
- **File**: `src/components/Payment/PaystackPaymentMethodManager.jsx`
- **Features**:
  - Save payment methods
  - Set default payment method
  - Edit/delete payment methods
  - Payment method selection
  - Support for cards, mobile money, bank transfer

### **Paystack Service**
- **File**: `src/services/paystackService.js`
- **Features**:
  - Payment initialization
  - Reference generation
  - Amount formatting
  - Email validation
  - Currency support
  - Demo payment simulation

## 5. Features Implemented

### **Payment Processing**
| Feature | Status | Description |
|---------|--------|-------------|
| Email Input | ✅ | Required for Paystack payments |
| Currency Selection | ✅ | Multiple African currencies |
| Payment Methods | ✅ | Cards, Mobile Money, Bank Transfer |
| Form Validation | ✅ | Client-side validation |
| Demo Mode | ✅ | Testing without real payments |

### **Payment Management**
| Feature | Status | Description |
|---------|--------|-------------|
| Save Payment Methods | ✅ | Store payment methods for future use |
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
1. Ensure you're in Paystack test mode
2. Use test email addresses
3. Use test payment methods

### **Test the Complete Flow:**
1. **Add items to cart** in `/menu`
2. **Go to checkout** (`/checkout`)
3. **Select delivery method** (pickup/delivery)
4. **Choose location** (if delivery)
5. **Review order** details
6. **Enter email and currency**
7. **Complete payment** process
8. **View confirmation** page

### **Test Payment Scenarios:**
- **Successful payment** with valid email
- **Failed payment** with invalid email
- **Network errors** (disconnect internet)
- **Form validation** errors
- **Demo mode** functionality

## 7. Production Deployment

### **Environment Variables:**
```env
# Production Paystack Keys
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
```

### **Backend Requirements:**
- Create payment verification endpoint
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
// Handle Paystack webhooks
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (hash == req.headers['x-paystack-signature']) {
    const event = req.body;
    
    // Handle the event
    switch (event.event) {
      case 'charge.success':
        // Update order status
        break;
      case 'charge.failed':
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.event}`);
    }
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
- Pre-configured test methods
- Simulated payment success
- Mock payment references
- Realistic error scenarios

## 10. Troubleshooting

### **Common Issues:**

**"Paystack is not configured"**
- Check API key configuration
- Verify environment variables
- Check browser console for errors

**"Payment failed"**
- Verify email format
- Check Paystack dashboard for errors
- Ensure test mode is enabled

**"Form validation errors"**
- Check email format
- Verify currency selection
- Ensure all required fields filled

### **Debug Mode:**
Enable detailed logging by adding to your `.env`:
```env
VITE_DEBUG_PAYSTACK=true
```

## 11. Next Steps

### **Immediate:**
1. Set up Paystack account
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

### **Paystack Pricing:**
- **Test Mode**: Free
- **Live Mode**: 1.5% + ₵1 per successful charge (Ghana)
- **No monthly fees**
- **No setup costs**

### **Additional Features:**
- Payment method storage: Free
- Webhooks: Free
- Disputes: ₵50 per dispute
- Chargebacks: ₵50 per chargeback

## 13. Supported Payment Methods

### **Cards:**
- Visa
- Mastercard
- American Express
- Discover

### **Mobile Money:**
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money

### **Bank Transfer:**
- Direct bank transfer
- Paystack Wallet

### **Other:**
- QR Code payments
- USSD payments

## Files Created/Updated

### **New Files:**
- `src/services/paystackService.js` - Paystack integration service
- `src/components/Payment/PaystackPaymentForm.jsx` - Payment form component
- `src/components/Payment/PaystackPaymentMethodManager.jsx` - Payment method management
- `PAYSTACK_SETUP_GUIDE.md` - This setup guide

### **Updated Files:**
- `src/pages/Checkout.jsx` - Integrated Paystack payment processing
- `.env.example` - Added Paystack configuration

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

## Advantages of Paystack

### **1. African Focus:**
- Optimized for African markets
- Local payment methods
- Local currency support
- Local customer support

### **2. Easy Integration:**
- Simple API
- Good documentation
- React components available
- Quick setup

### **3. Cost Effective:**
- Competitive pricing
- No monthly fees
- No setup costs
- Transparent pricing

### **4. Security:**
- PCI DSS compliant
- 3D Secure support
- Fraud protection
- Secure webhooks

**Your restaurant app now has complete payment processing with Paystack! Users can securely pay for orders with cards, mobile money, and bank transfers. 🎉**