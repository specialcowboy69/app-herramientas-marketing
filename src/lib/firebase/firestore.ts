import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  limit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './client';
import { Project } from '../types';

const PROJECTS_COLLECTION = 'projects';

/**
 * Scalable pagination utility using Firestore cursors.
 */
export const getPaginatedDocs = async (
  collectionPath: string,
  pageSize: number = 10,
  lastDoc: DocumentSnapshot | null = null
) => {
  let q = query(
    collection(db, collectionPath),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return {
    docs,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1] || null
  };
};

export const createProject = async (userId: string, data: Partial<Project>) => {
  const projectData = {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    language: data.language || 'es',
    context: data.context || {},
  };
  
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), projectData);
  return { id: docRef.id, ...projectData };
};

export const getUserProjects = async (userId: string) => {
  const q = query(
    collection(db, PROJECTS_COLLECTION),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Project[];
};

export const getProject = async (projectId: string) => {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Project;
  }
  return null;
};

export const updateProject = async (projectId: string, data: Partial<Project>) => {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (projectId: string) => {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(docRef);
};

// Generations
const GENERATIONS_COLLECTION = 'generations';

export const saveGeneration = async (projectId: string, userId: string, data: any) => {
  const genData = {
    ...data,
    projectId,
    userId,
    isFavorite: false,
    createdAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, PROJECTS_COLLECTION, projectId, GENERATIONS_COLLECTION), genData);
  return { id: docRef.id, ...genData };
};

export const getProjectGenerations = async (projectId: string) => {
  const q = query(
    collection(db, PROJECTS_COLLECTION, projectId, GENERATIONS_COLLECTION),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const toggleFavoriteGeneration = async (projectId: string, generationId: string, isFavorite: boolean) => {
  const docRef = doc(db, PROJECTS_COLLECTION, projectId, GENERATIONS_COLLECTION, generationId);
  await updateDoc(docRef, { isFavorite });
};
