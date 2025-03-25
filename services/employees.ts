import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "@/lib/supabase"

export type Employee = {
  id: string
  name: string
  avatar: string
  title: string
  department: string
  location: string
  salary: string
  startDate: string
  status: string
}

export async function getAllEmployees() {
  const { data, error } = await getEmployees()

  if (error) {
    console.error("Error fetching employees:", error)
    return []
  }

  return data as Employee[]
}

export async function addEmployee(employee: Omit<Employee, "id">) {
  const { data, error } = await createEmployee(employee)

  if (error) {
    console.error("Error creating employee:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateEmployeeById(id: string, updates: Partial<Employee>) {
  const { data, error } = await updateEmployee(id, updates)

  if (error) {
    console.error("Error updating employee:", error)
    throw new Error(error.message)
  }

  return data
}

export async function removeEmployee(id: string) {
  const { data, error } = await deleteEmployee(id)

  if (error) {
    console.error("Error deleting employee:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getEmployeesByDepartment(departmentId: string) {
  const { data, error } = await getEmployees()

  if (error) {
    console.error("Error fetching employees by department:", error)
    return []
  }

  return (data as Employee[]).filter((employee) => employee.department === departmentId)
}

