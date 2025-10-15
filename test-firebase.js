const { getFirestoreDb } = require('./lib/firebase');

async function testFirebaseConnection() {
  try {
    console.log('🔄 Testing Firebase connection...');
    
    const db = getFirestoreDb();
    
    // Test basic connection
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Firebase Admin SDK connected successfully');
    
    // Test menu items collection access
    const menuItemsRef = db.collection('menuItems');
    const snapshot = await menuItemsRef.limit(1).get();
    console.log(`✅ Menu items collection accessible (${snapshot.size} items found)`);
    
    console.log('\n🎉 All Firebase connections working!');
    console.log('\n📋 Configuration Summary:');
    console.log(`- Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log(`- Client Email: ${process.env.FIREBASE_CLIENT_EMAIL}`);
    console.log(`- Collection: menuItems`);
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
    process.exit(1);
  }
}

testFirebaseConnection();
