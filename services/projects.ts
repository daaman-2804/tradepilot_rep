import { createProject, deleteProject, getProjects, updateProject } from "@/lib/supabase"

export type Project = {
  id: string
  name: string
  description: string
  status: "Not Started" | "In Progress" | "On Hold" | "Completed" | "Cancelled"
  priority: "Low" | "Medium" | "High" | "Urgent"
  startDate: string
  endDate: string
  budget: string
  clientId?: string
  clientName?: string
  departmentId?: string
  departmentName?: string
  progress: number
  tasks: Task[]
  teamMembers: TeamMember[]
}

export type Task = {
  id: string
  title: string
  description: string
  status: "To Do" | "In Progress" | "In Review" | "Completed"
  assigneeId?: string
  assigneeName?: string
  dueDate?: string
  priority: "Low" | "Medium" | "High" | "Urgent"
}

export type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
}

export async function getAllProjects() {
  const { data, error } = await getProjects()

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data as Project[]
}

export async function addProject(project: Omit<Project, "id">) {
  const { data, error } = await createProject(project)

  if (error) {
    console.error("Error creating project:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateProjectById(id: string, updates: Partial<Project>) {
  const { data, error } = await updateProject(id, updates)

  if (error) {
    console.error("Error updating project:", error)
    throw new Error(error.message)
  }

  return data
}

export async function removeProject(id: string) {
  const { data, error } = await deleteProject(id)

  if (error) {
    console.error("Error deleting project:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getProjectsByDepartment(departmentId: string) {
  const { data, error } = await getProjects()

  if (error) {
    console.error("Error fetching projects by department:", error)
    return []
  }

  return (data as Project[]).filter((project) => project.departmentId === departmentId)
}

export async function getProjectsByClient(clientId: string) {
  const { data, error } = await getProjects()

  if (error) {
    console.error("Error fetching projects by client:", error)
    return []
  }

  return (data as Project[]).filter((project) => project.clientId === clientId)
}

