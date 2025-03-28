
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
import { 
  collection, 
  getDocs, 
  query,
  where,
} from "firebase/firestore"
import { db, auth } from "@/src/firebase"
import { onAuthStateChanged } from "firebase/auth"

type DynamicClient = {
  buyerName: string
  company: string
  email: string
  phone: string
  totalInvoices: number
  totalAmount: number
  lastInvoiceDate: string
}

type ClientListProps = {
  onSelectClient: (clientName: string) => void
  selectedClientName: string | null
}

export function ClientList({ onSelectClient, selectedClientName }: ClientListProps) {
  const [clients, setClients] = useState<DynamicClient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        loadClientsFromInvoices(user.uid)
      } else {
        setUserId(null)
        setClients([])
      }
    })

    return () => unsubscribe()
  }, [])

  const loadClientsFromInvoices = async (currentUserId: string) => {
    try {
      // Fetch invoices for the current user
      const invoicesCollection = collection(db, "users", currentUserId, "invoices")
      const invoicesSnapshot = await getDocs(invoicesCollection)

      // Process invoices to create dynamic client list
      const clientMap = new Map<string, DynamicClient>()

      invoicesSnapshot.docs.forEach(doc => {
        const invoiceData = doc.data()
        const buyerName = invoiceData.buyerName || "Unknown Client"
        const amount = parseFloat(invoiceData.amount?.replace(/[^0-9.-]+/g, "") || "0")

        if (!clientMap.has(buyerName)) {
          clientMap.set(buyerName, {
            buyerName,
            company: invoiceData.company || "",
            email: invoiceData.email || "",
            phone: invoiceData.phone || "",
            totalInvoices: 1,
            totalAmount: amount,
            lastInvoiceDate: invoiceData.date || ""
          })
        } else {
          const existingClient = clientMap.get(buyerName)!
          clientMap.set(buyerName, {
            ...existingClient,
            totalInvoices: existingClient.totalInvoices + 1,
            totalAmount: existingClient.totalAmount + amount,
            lastInvoiceDate: invoiceData.date > existingClient.lastInvoiceDate 
              ? invoiceData.date 
              : existingClient.lastInvoiceDate
          })
        }
      })

      // Convert map to array and sort
      const clientList = Array.from(clientMap.values())
        .sort((a, b) => b.totalInvoices - a.totalInvoices)

      setClients(clientList)

      // Select first client if none selected
      if (clientList.length > 0 && !selectedClientName) {
        onSelectClient(clientList[0].buyerName)
      }
    } catch (error) {
      console.error("Error loading clients from invoices:", error)
    }
  }

  const filteredClients = searchTerm
    ? clients.filter(
        (client) =>
          client.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.company.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : clients

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white text-lg">Clients</CardTitle>
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
            disabled={!userId}
          />
        </div>

        {!userId ? (
          <div className="text-center py-8">
            <p className="text-white/70">Please sign in to view clients</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/70">No clients found</p>
            <p className="text-white/50 text-sm mt-1">Upload an invoice to populate clients</p>
          </div>
        ) : (
          <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredClients.map((client) => (
              <li
                key={client.buyerName}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedClientName === client.buyerName
                    ? "bg-blue-600/30 border border-blue-400/30"
                    : "hover:bg-white/5 border border-white/10"
                }`}
                onClick={() => onSelectClient(client.buyerName)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 rounded-full p-2">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{client.buyerName}</p>
                    <p className="text-sm text-white/70">{client.company}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-white/50 flex justify-between">
                  <span>Invoices: {client.totalInvoices}</span>
                  <span>Total: ${client.totalAmount.toFixed(2)}</span>
                  <span>Last Invoice: {client.lastInvoiceDate}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}