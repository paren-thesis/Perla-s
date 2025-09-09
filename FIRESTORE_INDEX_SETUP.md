# Firestore Index Setup Guide

## Overview
Firestore requires composite indexes for queries that use multiple fields. The error you're seeing is normal and expected.

## Required Indexes

### 1. Bookings Index
**Collection**: `bookings`
**Fields**: 
- `userId` (Ascending)
- `createdAt` (Descending)

**Create Index**: [Click here to create](https://console.firebase.google.com/v1/r/project/parla-s/firestore/indexes?create_composite=Clxwcm9qZWN0cy9wYXJsYS1zL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbnMvYm9va2luZ3MvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg)

### 2. Orders Index
**Collection**: `orders`
**Fields**:
- `userId` (Ascending)
- `createdAt` (Descending)

**Create Index**: [Click here to create](https://console.firebase.google.com/v1/r/project/parla-s/firestore/indexes?create_composite=Clxwcm9qZWN0cy9wYXJsYS1zL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbnMvb3JkZXJzL2luZGV4ZXMvX0EAGgoKBnVzZXJJZBABGg0KC2NyZWF0ZWRBdBAAGgwKCF9fbmFtZV9fEAE)

## How to Create Indexes

### Method 1: Use the Error Links
1. Click on the error links provided above
2. They will take you directly to the Firebase Console
3. Click "Create Index" to create the required indexes

### Method 2: Manual Creation
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database
4. Click on "Indexes" tab
5. Click "Create Index"
6. Add the required fields as specified above

## Index Creation Time
- **Single-field indexes**: Created automatically
- **Composite indexes**: Take 2-10 minutes to build
- **Large collections**: May take longer

## After Creating Indexes
1. Wait for indexes to be built
2. Refresh your application
3. The errors should disappear
4. Queries will work properly

## Alternative: Disable Index Warnings
If you want to disable the warnings temporarily, you can add this to your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Your existing rules
  }
}
```

But it's better to create the indexes for optimal performance.

## Performance Impact
- **Without indexes**: Queries will be slow or fail
- **With indexes**: Queries will be fast and efficient
- **Cost**: Indexes don't increase storage costs significantly

The indexes are essential for your app to work properly, so please create them using the links provided above.