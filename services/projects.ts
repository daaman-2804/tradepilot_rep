import { db } from "@/components/firebase"; // Import Firestore
import { doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: "Not Started" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Urgent";
  startDate: string;
  endDate: string;
  budget: string;
  clientId?: string;
  clientName?: string;
  departmentId?: string;
  departmentName?: string;
  progress: number;
  tasks: Task[];
  teamMembers: TeamMember[];
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "In Review" | "Completed";
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export async function getAllProjects() {
  const projectsCollection = collection(db, "projects");
  const projectSnapshot = await getDocs(projectsCollection);
  return projectSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as Project;
  });
}

export async function addProject(project: Omit<Project, "id">) {
  const newProjectRef = doc(collection(db, "projects"));
  await setDoc(newProjectRef, project);
  return { id: newProjectRef.id, ...project };
}

export async function updateProjectById(id: string, updates: Partial<Project>) {
  const projectRef = doc(db, "projects", id);
  await setDoc(projectRef, updates, { merge: true });
}

export async function removeProject(id: string) {
  const projectRef = doc(db, "projects", id);
  await deleteDoc(projectRef);
}

export async function getProjectsByDepartment(departmentId: string) {
  const projectsCollection = collection(db, "projects");
  const projectSnapshot = await getDocs(projectsCollection);
  return projectSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as Project;
  }).filter((project) => project.departmentId === departmentId);
}

export async function getProjectsByClient(clientId: string) {
  const projectsCollection = collection(db, "projects");
  const projectSnapshot = await getDocs(projectsCollection);
  return projectSnapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, ...data } as Project;
  }).filter((project) => project.clientId === clientId);
}

