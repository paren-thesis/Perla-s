# Firestore Setup Guide

## Step 1: Enable Firestore in Firebase Console

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. In the left sidebar, click on "Firestore Database"
4. Click "Create database"
5. Choose "Start in test mode" (we'll update security rules later)
6. Select a location for your database (choose the closest to your users)

## Step 2: Set Up Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with the content from `firestore.rules` file
3. Click "Publish"

## Step 3: Create Initial Collections

You don't need to create collections manually - they will be created automatically when you add the first document. However, you can create them in advance if you prefer:

### Collections to be created:
- `users` - User profiles and preferences
- `menuItems` - Restaurant menu items
- `bookings` - Table reservations
- `orders` - Customer orders
- `cart` - User shopping carts
- `deliveryAddresses` - User delivery addresses

## Step 4: Add Sample Menu Items (Optional)

You can add some sample menu items to test the system:

1. Go to Firestore Database
2. Click "Start collection"
3. Name it "menuItems"
4. Add documents with the following structure:

```json
{
  "name": "Jollof Rice",
  "description": "Traditional Ghanaian rice dish with tomatoes and spices",
  "price": 15.99,
  "category": "lunch",
  "image": "/images/foods/Jollof.jpeg",
  "ingredients": ["rice", "tomatoes", "onions", "spices"],
  "dietaryInfo": {
    "vegetarian": false,
    "vegan": false,
    "glutenFree": true
  },
  "availability": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## Step 5: Test the Connection

1. Start your development server: `npm run dev`
2. Check the browser console for any Firestore connection errors
3. Try logging in and out to see if user profiles are being created

## Step 6: Environment Variables

Make sure your `.env` file contains all the required Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Troubleshooting

### Common Issues:

1. **Permission denied errors**: Check your Firestore security rules
2. **Collection not found**: Collections are created automatically when first document is added
3. **Authentication errors**: Make sure user is logged in before accessing Firestore
4. **Network errors**: Check your internet connection and Firebase project status

### Testing Commands:

```javascript
// Test Firestore connection in browser console
import { db } from './src/firebase.js';
console.log('Firestore connected:', db);
```

## Next Steps

Once Firestore is set up and working:

1. We'll implement the location services
2. Add delivery address management
3. Integrate Stripe payments
4. Add real-time order tracking

The foundation is now ready for all the advanced features!