// Server-side hero image service (uses Firebase Admin)
import { getFirestoreDb } from '../lib/firebase';

const HERO_DOC_ID = 'homepage-hero';
const HERO_COLLECTION = 'siteSettings';

// Cache for hero image to avoid repeated database calls
let heroImageCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30 * 1000; // 30 seconds

// Clear cache when data is modified
const clearCache = () => {
  heroImageCache = null;
  cacheTimestamp = null;
};

/**
 * Get current hero image data
 * Returns base64 image string and metadata
 */
export async function getHeroImage() {
  try {
    // Check if we have valid cached data
    if (heroImageCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return heroImageCache;
    }
    
    const db = getFirestoreDb();
    const docRef = db.collection(HERO_COLLECTION).doc(HERO_DOC_ID);
    const docSnap = await docRef.get();

    const heroData = docSnap.exists ? docSnap.data() : null;
    
    // Update cache
    heroImageCache = heroData;
    cacheTimestamp = Date.now();
    
    return heroData;
  } catch (error) {
    console.error('Error fetching hero image:', error);
    throw new Error('Failed to fetch hero image: ' + error.message);
  }
}

/**
 * Save hero image to Firestore
 * Image is stored as base64 string (same as menu items)
 * @param {string} imageBase64 - Base64 encoded image string
 */
export async function saveHeroImage(imageBase64) {
  try {
    const db = getFirestoreDb();
    const docRef = db.collection(HERO_COLLECTION).doc(HERO_DOC_ID);
    
    const heroData = {
      image: imageBase64, // Store base64 string directly
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await docRef.set(heroData, { merge: true });
    
    // Clear cache to ensure fresh data on next fetch
    clearCache();
    
    return heroData;
  } catch (error) {
    console.error('Error saving hero image:', error);
    throw new Error('Failed to save hero image: ' + error.message);
  }
}

/**
 * Clear hero image from Firestore
 */
export async function clearHeroImage() {
  try {
    const db = getFirestoreDb();
    const docRef = db.collection(HERO_COLLECTION).doc(HERO_DOC_ID);
    
    await docRef.set({
      image: null,
      uploadedAt: null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    // Clear cache to ensure fresh data on next fetch
    clearCache();
    
    return true;
  } catch (error) {
    console.error('Error clearing hero image:', error);
    throw new Error('Failed to clear hero image: ' + error.message);
  }
}
