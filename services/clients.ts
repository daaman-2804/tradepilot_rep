import { createClient, deleteClient, getClients, updateClient } from "@/lib/supabase"

export type Client = {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  lastInvoice?: string
  totalSpent?: number
  invoiceCount?: number
}

export async function getAllClients() {
  const { data, error } = await getClients()

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data as Client[]
}

export async function addClient(client: Omit<Client, "id">) {
  const { data, error } = await createClient(client)

  if (error) {
    console.error("Error creating client:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateClientById(id: string, updates: Partial<Client>) {
  const { data, error } = await updateClient(id, updates)

  if (error) {
    console.error("Error updating client:", error)
    throw new Error(error.message)
  }

  return data
}

export async function removeClient(id: string) {
  const { data, error } = await deleteClient(id)

  if (error) {
    console.error("Error deleting client:", error)
    throw new Error(error.message)
  }

  return data
}

