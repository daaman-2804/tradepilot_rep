import { db } from "@/components/firebase"; // Import Firestore
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

export type Employee = {
  id: string;
  name: string;
  avatar: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  startDate: string;
  status: string;
};

export async function getAllEmployees() {
  const employeesCollection = collection(db, "employees");
  const employeeSnapshot = await getDocs(employeesCollection);
  return employeeSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as Employee;
  });
}

export async function addEmployee(employee: Omit<Employee, "id">) {
  const newEmployeeRef = doc(collection(db, "employees"));
  await setDoc(newEmployeeRef, employee);
  return { id: newEmployeeRef.id, ...employee };
}

export async function updateEmployeeById(id: string, updates: Partial<Employee>) {
  const employeeRef = doc(db, "employees", id);
  await setDoc(employeeRef, updates, { merge: true });
}

export async function removeEmployee(id: string) {
  const employeeRef = doc(db, "employees", id);
  await deleteDoc(employeeRef);
}

export async function getEmployeesByDepartment(departmentId: string) {
  const employeesCollection = collection(db, "employees");
  const employeeSnapshot = await getDocs(employeesCollection);
  return employeeSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as Employee;
  }).filter((employee) => employee.department === departmentId);
}

