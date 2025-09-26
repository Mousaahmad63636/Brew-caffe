import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User, LoginCredentials, RegisterCredentials } from '@/types/auth'

const USERS_COLLECTION = 'users'

export class AuthService {
  static async signInWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = await this.getUserProfile(userCredential.user.uid)
      if (!user) {
        throw new Error('User profile not found')
      }
      return user
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Invalid email or password')
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Failed to logout')
    }
  }

  static async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )
      
      const user = await this.getUserProfile(userCredential.user.uid)
      if (!user) {
        throw new Error('User profile not found')
      }
      
      return user
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.message || 'Failed to login')
    }
  }
  static async register(credentials: RegisterCredentials): Promise<User> {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      )

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: credentials.name
      })

      // Create user profile in Firestore
      const userData: Omit<User, 'id'> = {
        email: credentials.email,
        name: credentials.name,
        role: 'user', // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await setDoc(doc(db, USERS_COLLECTION, userCredential.user.uid), {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })

      return {
        id: userCredential.user.uid,
        ...userData,
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      throw new Error(error.message || 'Failed to register')
    }
  }
  static async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Failed to logout')
    }
  }

  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId))
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as User
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await this.getUserProfile(firebaseUser.uid)
        callback(userProfile)
      } else {
        callback(null)
      }
    })
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  }
}