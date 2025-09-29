import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

const HERO_DOC_ID = 'homepage-hero';
const HERO_COLLECTION = 'siteSettings';

/**
 * Get current hero image data
 */
export async function getHeroImage() {
  try {
    const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching hero image:', error);
    throw new Error('Failed to fetch hero image: ' + error.message);
  }
}

/**
 * Save hero image data to Firestore
 * Image itself is stored in /public/hero-images/
 * Only filename and metadata stored in Firestore
 */
export async function saveHeroImage(heroData) {
  try {
    const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
    await setDoc(docRef, {
      ...heroData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error saving hero image:', error);
    throw new Error('Failed to save hero image: ' + error.message);
  }
}

/**
 * Clear hero image data from Firestore
 */
export async function clearHeroImage() {
  try {
    const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
    await setDoc(docRef, {
      filename: null,
      path: null,
      uploadedAt: null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error clearing hero image:', error);
    throw new Error('Failed to clear hero image: ' + error.message);
  }
}
