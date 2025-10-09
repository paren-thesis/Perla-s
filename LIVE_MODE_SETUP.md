# 🚀 PayStack Live Mode Setup Guide

## ✅ Your Integration is Now Live Mode Ready!

Since you have your PayStack API keys locally, your integration will automatically detect and switch to the appropriate mode based on your keys.

## 🔍 **Mode Detection**

The system automatically detects the mode based on your API keys:

- **Demo Mode**: No API keys → Simulated payments
- **Test Mode**: `sk_test_...` keys → PayStack sandbox
- **Live Mode**: `sk_live_...` keys → Real money transactions

## 🎯 **Current Setup Options**

### Option 1: Direct API (Current - Development/Testing)
```env
# Your current .env file
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_live_key
VITE_PAYSTACK_SECRET_KEY=sk_live_your_actual_live_key
```

### Option 2: Backend Proxy (Recommended for Production)
```env
# Production setup
VITE_USE_BACKEND_PROXY=true
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_PAYSTACK_MODE=live
# Remove VITE_PAYSTACK_SECRET_KEY
```

## 🛡️ **Live Mode Safety Features**

### 1. **Visual Indicators**
- **Red "LIVE MODE" badge** in payment form header
- **Warning messages** about real money transactions
- **Different button text**: "💰 PAY (REAL MONEY)"

### 2. **Confirmation Dialogs**
- **Double confirmation** before processing live payments
- **Amount and details verification** popup
- **User cancellation** option

### 3. **Console Logging**
- **Live mode warnings** in browser console
- **Transaction tracking** with detailed logs
- **Success notifications** for completed payments

### 4. **Error Handling**
- **Enhanced error messages** for mobile money issues
- **Network failure recovery**
- **Transaction verification** after payment

## 📱 **Ghana Mobile Money (Live Mode)**

### **Supported Providers**
- **MTN Mobile Money** (Most popular)
- **Vodafone Cash**
- **AirtelTigo Money**

### **Live Phone Numbers**
- Use **real Ghana mobile money numbers** (+233XXXXXXXXX)
- Test numbers won't work in live mode
- Customers need **sufficient balance** in their mobile money accounts

### **Payment Flow**
1. Customer enters **real email** and **mobile money number**
2. System shows **live mode warning**
3. **Confirmation dialog** with transaction details
4. PayStack popup opens for **real payment**
5. Customer completes payment on **mobile device**
6. **Real money** is deducted from customer's account
7. Transaction **automatically verified**
8. Order processed and **receipt sent**

## ⚠️ **Important Live Mode Considerations**

### **Real Money Transactions**
- ✅ **Real charges** to customer mobile money accounts
- ✅ **Actual money** transferred to your PayStack account
- ✅ **Transaction fees** apply (PayStack's standard rates)
- ✅ **Refunds** must be processed through PayStack dashboard

### **Testing in Live Mode**
- ⚠️ **Use small amounts** for testing (e.g., ₵1.00)
- ⚠️ **Test with your own** mobile money account first
- ⚠️ **Verify webhook** notifications work correctly
- ⚠️ **Check PayStack dashboard** for transaction records

### **Customer Experience**
- 📱 Customers receive **SMS notifications** from mobile money provider
- 📧 Email receipts sent to customer's email address
- 🔔 Real-time payment confirmations
- 💰 Immediate balance deduction from mobile money account

## 🚀 **Going Live Checklist**

### **PayStack Account**
- [ ] Business verification completed
- [ ] Live API keys obtained (`pk_live_...` and `sk_live_...`)
- [ ] Webhook URLs configured
- [ ] Settlement account verified

### **Application Setup**
- [ ] Live API keys added to `.env` file
- [ ] Test small transaction (₵1.00)
- [ ] Verify webhook notifications
- [ ] Check transaction appears in PayStack dashboard
- [ ] Test mobile money refund process

### **Production Deployment**
- [ ] Set up backend proxy (recommended)
- [ ] Remove secret keys from frontend
- [ ] Configure HTTPS
- [ ] Set up monitoring and logging
- [ ] Test with real customers

## 🔧 **Quick Test Commands**

### **Check Current Mode**
Open browser console and look for:
```
PayStack Mode: LIVE
🚨 LIVE MODE ACTIVE - Real money transactions enabled!
```

### **Test Transaction Flow**
1. Add items to cart
2. Go to checkout
3. Enter **your real email** and **mobile money number**
4. Look for **red "LIVE MODE"** warning
5. Confirm the **double confirmation** dialog
6. Complete payment with **small amount** (₵1.00)

## 📊 **Monitoring Live Transactions**

### **Browser Console Logs**
```
PayStack LIVE transaction initialized: {
  reference: "PAYSTACK_ORDER123_1234567890",
  amount: 1.00,
  currency: "GHS",
  channels: ["mobile_money"]
}

💰 LIVE PAYMENT SUCCESSFUL - Real money received!
```

### **PayStack Dashboard**
- Check **Transactions** tab for live payments
- Monitor **successful/failed** transaction rates
- Review **settlement** reports
- Set up **webhook** notifications

## 🆘 **Troubleshooting Live Mode**

### **Common Issues**
1. **"Insufficient funds"** → Customer needs to top up mobile money
2. **"Invalid phone number"** → Use correct Ghana format (+233...)
3. **"Transaction failed"** → Check network connectivity
4. **"Payment timeout"** → Customer didn't complete USSD prompt

### **Support Contacts**
- **PayStack Support**: support@paystack.com
- **MTN Mobile Money**: 100 (from MTN line)
- **Vodafone Cash**: 100 (from Vodafone line)
- **AirtelTigo Money**: 100 (from AirtelTigo line)

## 🎉 **You're Ready for Live Payments!**

Your PayStack integration is now fully configured for live mode with:
- ✅ **Automatic mode detection**
- ✅ **Ghana mobile money support**
- ✅ **Safety confirmations**
- ✅ **Real-time verification**
- ✅ **Production-ready architecture**

Start with small test transactions and gradually increase as you gain confidence with the live system!