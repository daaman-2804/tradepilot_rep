import { createInvoice, deleteInvoice, getInvoices, updateInvoice } from "@/lib/supabase"

export type Invoice = {
  id: string
  buyerName: string
  invoiceNumber: string
  amount: string
  date: string
  timestamp: string
  shipmentStatus?: string
  shipmentDate?: string
  shipmentMethod?: string
  items?: Array<{
    name: string
    quantity: number
    price: string
  }>
}

export async function getAllInvoices() {
  const { data, error } = await getInvoices()

  if (error) {
    console.error("Error fetching invoices:", error)
    return []
  }

  return data as Invoice[]
}

export async function addInvoice(invoice: Omit<Invoice, "id">) {
  const { data, error } = await createInvoice(invoice)

  if (error) {
    console.error("Error creating invoice:", error)
    throw new Error(error.message)
  }

  return data
}

export async function updateInvoiceById(id: string, updates: Partial<Invoice>) {
  const { data, error } = await updateInvoice(id, updates)

  if (error) {
    console.error("Error updating invoice:", error)
    throw new Error(error.message)
  }

  return data
}

export async function removeInvoice(id: string) {
  const { data, error } = await deleteInvoice(id)

  if (error) {
    console.error("Error deleting invoice:", error)
    throw new Error(error.message)
  }

  return data
}

export async function getInvoicesByClient(clientName: string) {
  const { data, error } = await getInvoices()

  if (error) {
    console.error("Error fetching invoices by client:", error)
    return []
  }

  return (data as Invoice[]).filter((invoice) => invoice.buyerName.toLowerCase() === clientName.toLowerCase())
}

