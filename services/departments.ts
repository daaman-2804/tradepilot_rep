import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from "@/lib/supabase"

export type Department = {
  id: string
  name: string
  description: string
  employeeCount: number
  budget: string
  manager: string
  color: string
}

export async function getAllDepartments() {
  const { data, error } = await getDepartments()

  if (error) {
    console.error("Error fetching departments:", error)
    return []
  }

  return data as Department[]
}

export async function addDepartment(department: Omit<Department, "id">) {
  const { data, error } = await createDepartment(department)

  if (error) {
    console.error("Error creating department:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateDepartmentById(id: string, updates: Partial<Department>) {
  const { data, error } = await updateDepartment(id, updates)

  if (error) {
    console.error("Error updating department:", error)
    throw new Error(error.message)
  }

  return data
}

export async function removeDepartment(id: string) {
  const { data, error } = await deleteDepartment(id)

  if (error) {
    console.error("Error deleting department:", error)
    throw new Error(error.message)
  }

  return data
}

