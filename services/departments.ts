import { db } from "@/components/firebase"; // Import Firestore
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

export type Department = {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  budget: string;
  manager: string;
  color: string;
};

export async function getAllDepartments() {
  const departmentsCollection = collection(db, "departments");
  const departmentSnapshot = await getDocs(departmentsCollection);
  return departmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Department[];
}

export async function addDepartment(department: Omit<Department, "id">) {
  const newDepartmentRef = doc(collection(db, "departments"));
  await setDoc(newDepartmentRef, department);
  return { id: newDepartmentRef.id, ...department };
}

export async function updateDepartmentById(id: string, updates: Partial<Department>) {
  const departmentRef = doc(db, "departments", id);
  await setDoc(departmentRef, updates, { merge: true });
}

export async function removeDepartment(id: string) {
  const departmentRef = doc(db, "departments", id);
  await deleteDoc(departmentRef);
}

