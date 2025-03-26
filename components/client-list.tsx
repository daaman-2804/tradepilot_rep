"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Building, User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { db } from "@/src/firebase"

type Client = {
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

type ClientListProps = {
  onSelectClient: (clientId: string) => void
  selectedClientId: string | null
}

export function ClientList({ onSelectClient, selectedClientId }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    const loadClients = async () => {
      const clientsCollection = collection(db, "clients")
      const clientSnapshot = await getDocs(clientsCollection)
      const clientList = clientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Client[]
      setClients(clientList)

      // Select the first client if none is selected
      if (clientList.length > 0 && !selectedClientId) {
        onSelectClient(clientList[0].id)
      }
    }

    loadClients()
  }, [onSelectClient, selectedClientId])

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()

    const newClientData: Client = {
      id: Date.now().toString(),
      ...newClient,
    }

    // Add new client to Firestore
    await addDoc(collection(db, "clients"), newClientData)

    // Notify components of the update
    window.dispatchEvent(new Event("clientsUpdated"))

    // Close the modal and reset form
    setShowAddClientModal(false)
    setNewClient({ name: "", company: "", email: "", phone: "", address: "" })

    // Select the new client
    onSelectClient(newClientData.id)
  }

  const filteredClients = searchTerm
    ? clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : clients

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white text-lg">Clients</CardTitle>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-white/20 text-white hover:bg-white/20 hover:text-white"
            onClick={() => setShowAddClientModal(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              type="search"
              placeholder="Search clients..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/70">No clients found</p>
              <p className="text-white/50 text-sm mt-1">Add a client or upload an invoice</p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredClients.map((client) => (
                <li
                  key={client.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedClientId === client.id
                      ? "bg-blue-600/30 border border-blue-400/30"
                      : "hover:bg-white/5 border border-white/10"
                  }`}
                  onClick={() => onSelectClient(client.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{client.name}</p>
                      <p className="text-sm text-white/70">{client.company}</p>
                    </div>
                  </div>
                  {client.lastInvoice && (
                    <div className="mt-2 text-xs text-white/50">Last invoice: {client.lastInvoice}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Add Client Modal */}
      <Dialog open={showAddClientModal} onOpenChange={setShowAddClientModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>Enter the client details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddClient}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input
                  id="company"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Client</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

