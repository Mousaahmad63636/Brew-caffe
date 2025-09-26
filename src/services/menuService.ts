import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { MenuItem, MenuCategory } from '@/types/menu'

const MENU_ITEMS_COLLECTION = 'menuItems'
const CATEGORIES_COLLECTION = 'categories'

export class MenuService {
  // Menu Items
  static async getMenuItems(): Promise<MenuItem[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, MENU_ITEMS_COLLECTION), orderBy('category'), orderBy('name'))
      )
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as MenuItem[]
    } catch (error) {
      console.error('Error fetching menu items:', error)
      throw new Error('Failed to fetch menu items')
    }
  }
  static async getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
      const docSnap = await getDoc(doc(db, MENU_ITEMS_COLLECTION, id))
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as MenuItem
      }
      return null
    } catch (error) {
      console.error('Error fetching menu item:', error)
      throw new Error('Failed to fetch menu item')
    }
  }

  static async createMenuItem(menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, MENU_ITEMS_COLLECTION), {
        ...menuItem,
        createdAt: now,
        updatedAt: now,
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating menu item:', error)
      throw new Error('Failed to create menu item')
    }
  }
  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    try {
      const docRef = doc(db, MENU_ITEMS_COLLECTION, id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating menu item:', error)
      throw new Error('Failed to update menu item')
    }
  }

  static async deleteMenuItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, MENU_ITEMS_COLLECTION, id))
    } catch (error) {
      console.error('Error deleting menu item:', error)
      throw new Error('Failed to delete menu item')
    }
  }

  // Categories
  static async getCategories(): Promise<MenuCategory[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, CATEGORIES_COLLECTION), orderBy('order'))
      )
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as MenuCategory[]
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw new Error('Failed to fetch categories')
    }
  }
  static async createCategory(category: Omit<MenuCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
        ...category,
        createdAt: now,
        updatedAt: now,
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating category:', error)
      throw new Error('Failed to create category')
    }
  }

  // Real-time listeners
  static subscribeToMenuItems(callback: (items: MenuItem[]) => void) {
    return onSnapshot(
      query(collection(db, MENU_ITEMS_COLLECTION), orderBy('category'), orderBy('name')),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as MenuItem[]
        callback(items)
      },
      (error) => {
        console.error('Error in menu items subscription:', error)
      }
    )
  }

  static subscribeToCategories(callback: (categories: MenuCategory[]) => void) {
    return onSnapshot(
      query(collection(db, CATEGORIES_COLLECTION), orderBy('order')),
      (snapshot) => {
        const categories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as MenuCategory[]
        callback(categories)
      },
      (error) => {
        console.error('Error in categories subscription:', error)
      }
    )
  }
}