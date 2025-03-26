import { db } from "@/components/firebase"; // Import Firestore
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

export type Invoice = {
  id: string;
  buyerName: string;
  invoiceNumber: string;
  amount: string;
  date: string;
  timestamp: string;
  shipmentStatus?: string;
  shipmentDate?: string;
  shipmentMethod?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
};

export async function getAllInvoices() {
  const invoicesCollection = collection(db, "invoices");
  const invoiceSnapshot = await getDocs(invoicesCollection);
  return invoiceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Invoice[];
}

export async function addInvoice(invoice: Omit<Invoice, "id">) {
  const newInvoiceRef = doc(collection(db, "invoices"));
  await setDoc(newInvoiceRef, invoice);
  return { id: newInvoiceRef.id, ...invoice };
}

export async function updateInvoiceById(id: string, updates: Partial<Invoice>) {
  const invoiceRef = doc(db, "invoices", id);
  await setDoc(invoiceRef, updates, { merge: true });
}

export async function removeInvoice(id: string) {
  const invoiceRef = doc(db, "invoices", id);
  await deleteDoc(invoiceRef);
}

export async function getInvoicesByClient(clientName: string) {
  const invoices = await getAllInvoices();
  return invoices.filter((invoice) => invoice.buyerName.toLowerCase() === clientName.toLowerCase());
}

