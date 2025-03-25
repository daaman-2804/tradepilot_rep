"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Mail, Phone, MapPin, FileText, Truck, Package, Calendar, DollarSign, Edit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

type Invoice = {
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

type ClientDetailsProps = {
  clientId: string | null
}

export function ClientDetails({ clientId }: ClientDetailsProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>([])
  const [shipments, setShipments] = useState<any[]>([])

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: client?.name || "",
    company: client?.company || "",
    email: client?.email || "",
    phone: client?.phone || "",
    address: client?.address || "",
  })

  // Update form data when client changes
  useEffect(() => {
    if (client) {
      setEditFormData({
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        address: client.address,
      })
    }
  }, [client])

  const handleEditClient = (e: React.FormEvent) => {
    e.preventDefault()

    if (!client) return

    // Create updated client object
    const updatedClient = {
      ...client,
      ...editFormData,
    }

    // Update client in localStorage
    const clients = JSON.parse(localStorage.getItem("clients") || "[]")
    const updatedClients = clients.map((c: Client) => (c.id === client.id ? updatedClient : c))
    localStorage.setItem("clients", JSON.stringify(updatedClients))

    // Update local state
    setClient(updatedClient)

    // Notify components of the update
    window.dispatchEvent(new Event("clientsUpdated"))

    // Close dialog
    setIsEditDialogOpen(false)
  }

  useEffect(() => {
    if (!clientId) return

    // Load client data
    const clients = JSON.parse(localStorage.getItem("clients") || "[]")
    const foundClient = clients.find((c: Client) => c.id === clientId)

    if (foundClient) {
      setClient(foundClient)

      // Load invoices for this client
      const allInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
      const matchingInvoices = allInvoices.filter(
        (invoice: Invoice) => invoice.buyerName.toLowerCase() === foundClient.name.toLowerCase(),
      )

      setClientInvoices(matchingInvoices)

      // Generate shipment data based on invoices
      const shipmentData = matchingInvoices.map((invoice: Invoice) => {
        // Generate random shipment data if not present
        if (!invoice.shipmentStatus) {
          const statuses = ["Delivered", "In Transit", "Processing", "Shipped"]
          const methods = ["Standard", "Express", "Priority", "Economy"]

          return {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            date: invoice.date,
            estimatedDelivery: new Date(
              new Date(invoice.timestamp).getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000,
            ).toLocaleDateString(),
            method: methods[Math.floor(Math.random() * methods.length)],
            trackingNumber: `TRK${Math.floor(Math.random() * 1000000)
              .toString()
              .padStart(7, "0")}`,
          }
        }

        return {
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          status: invoice.shipmentStatus,
          date: invoice.date,
          estimatedDelivery: invoice.shipmentDate,
          method: invoice.shipmentMethod,
          trackingNumber: `TRK${Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(7, "0")}`,
        }
      })

      setShipments(shipmentData)
    }
  }, [clientId])

  if (!client) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-white/70">Select a client to view details</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate client metrics
  const totalSpent = clientInvoices.reduce((sum, invoice) => {
    const amount = Number.parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""))
    return sum + (isNaN(amount) ? 0 : amount)
  }, 0)

  const lastInvoiceDate = clientInvoices.length > 0 ? new Date(clientInvoices[0].timestamp) : null

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">{client.name}</CardTitle>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Edit className="h-4 w-4 mr-2" /> Edit Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Make changes to the client information here.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditClient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
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
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
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
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
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
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
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
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info">
          <TabsList className="bg-white/10 text-white mb-4">
            <TabsTrigger value="info" className="data-[state=active]:bg-blue-600">
              Info
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-blue-600">
              Invoices
            </TabsTrigger>
            <TabsTrigger value="shipments" className="data-[state=active]:bg-blue-600">
              Shipments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-full p-2">
                    <Building className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Company</p>
                    <p className="text-white">{client.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-full p-2">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Email</p>
                    <p className="text-white">{client.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-full p-2">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Phone</p>
                    <p className="text-white">{client.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-full p-2">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Address</p>
                    <p className="text-white">{client.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-blue-300" />
                    <p className="text-white font-medium">Invoice Summary</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-white/70">Total Invoices</p>
                      <p className="text-xl font-semibold text-white">{clientInvoices.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Total Spent</p>
                      <p className="text-xl font-semibold text-white">${totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Last Invoice</p>
                      <p className="text-white">
                        {lastInvoiceDate ? formatDistanceToNow(lastInvoiceDate, { addSuffix: true }) : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Client Since</p>
                      <p className="text-white">
                        {clientInvoices.length > 0
                          ? new Date(clientInvoices[clientInvoices.length - 1].date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="h-5 w-5 text-blue-300" />
                    <p className="text-white font-medium">Shipping Summary</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-white/70">Total Shipments</p>
                      <p className="text-xl font-semibold text-white">{shipments.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Active Shipments</p>
                      <p className="text-xl font-semibold text-white">
                        {shipments.filter((s) => s.status === "In Transit").length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Delivered</p>
                      <p className="text-white">{shipments.filter((s) => s.status === "Delivered").length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Preferred Method</p>
                      <p className="text-white">{shipments.length > 0 ? shipments[0].method : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="invoices">
            {clientInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/70">No invoices found</p>
                <p className="text-white/50 text-sm mt-1">Upload an invoice for this client</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clientInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-300" />
                        <p className="font-medium text-white">{invoice.invoiceNumber}</p>
                      </div>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-white/60" />
                          <p className="text-sm text-white/70">{invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3 w-3 text-white/60" />
                          <p className="text-sm text-white/70">{invoice.amount}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/20 hover:text-white"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shipments">
            {shipments.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/70">No shipments found</p>
                <p className="text-white/50 text-sm mt-1">Shipments will appear when invoices are processed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-300" />
                        <p className="font-medium text-white">Order #{shipment.invoiceNumber}</p>
                        <Badge
                          className={`ml-2 ${
                            shipment.status === "Delivered"
                              ? "bg-green-500/20 text-green-200"
                              : shipment.status === "In Transit"
                                ? "bg-blue-500/20 text-blue-200"
                                : "bg-yellow-500/20 text-yellow-200"
                          }`}
                        >
                          {shipment.status}
                        </Badge>
                      </div>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-white/60" />
                          <p className="text-sm text-white/70">Shipped: {shipment.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-3 w-3 text-white/60" />
                          <p className="text-sm text-white/70">{shipment.method} Shipping</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-3 w-3 text-white/60" />
                          <p className="text-sm text-white/70">Tracking: {shipment.trackingNumber}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/20 hover:text-white"
                      >
                        Track Package
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

