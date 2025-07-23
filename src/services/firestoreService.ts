import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

export interface FirestoreService {
  addDocument: (collectionName: string, data: any) => Promise<string>;
  getDocuments: (collectionName: string) => Promise<any[]>;
  getUserDocuments: (collectionName: string, userId: string) => Promise<any[]>;
  updateDocument: (collectionName: string, docId: string, data: any) => Promise<void>;
  deleteDocument: (collectionName: string, docId: string) => Promise<void>;
}

export const firestoreService: FirestoreService = {
  // Add a new document
  addDocument: async (collectionName: string, data: any): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Get all documents from a collection
  getDocuments: async (collectionName: string): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      throw error;
    }
  },

  // Get user-specific documents
  getUserDocuments: async (collectionName: string, userId: string): Promise<any[]> => {
    try {
      const q = query(
        collection(db, collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      throw error;
    }
  },

  // Update a document
  updateDocument: async (collectionName: string, docId: string, data: any): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (collectionName: string, docId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
    } catch (error) {
      throw error;
    }
  }
};
