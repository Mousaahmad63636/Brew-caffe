import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebaseClient';

const HERO_DOC_ID = 'homepage-hero';
const HERO_COLLECTION = 'siteSettings';

/**
 * Upload hero image to Firebase Storage
 */
export async function uploadHeroImage(file) {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const filename = `hero-images/hero-${timestamp}-${file.name}`;
    const storageRef = ref(storage, filename);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      filename: filename,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error uploading hero image:', error);
    throw new Error('Failed to upload image: ' + error.message);
  }
}

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
 * Delete hero image from storage
 */
export async function deleteHeroImage(filename) {
  try {
    if (filename) {
      const storageRef = ref(storage, filename);
      await deleteObject(storageRef);
    }
    
    // Clear from Firestore
    const docRef = doc(db, HERO_COLLECTION, HERO_DOC_ID);
    await setDoc(docRef, {
      url: null,
      filename: null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error deleting hero image:', error);
    throw new Error('Failed to delete hero image: ' + error.message);
  }
}
