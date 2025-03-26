import { db } from "@/components/firebase"; // Import Firestore
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  lastInvoice?: string;
  totalSpent?: number;
  invoiceCount?: number;
};

export async function getAllClients() {
  const clientsCollection = collection(db, "clients");
  const clientSnapshot = await getDocs(clientsCollection);
  return clientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Client[];
}

export async function addClient(client: Omit<Client, "id">) {
  const newClientRef = doc(collection(db, "clients"));
  await setDoc(newClientRef, client);
  return { id: newClientRef.id, ...client };
}

export async function updateClientById(id: string, updates: Partial<Client>) {
  const clientRef = doc(db, "clients", id);
  await setDoc(clientRef, updates, { merge: true });
}

export async function removeClient(id: string) {
  const clientRef = doc(db, "clients", id);
  await deleteDoc(clientRef);
}

