"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/src/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

type Invoice = {
  id: string
  buyerName: string
  invoiceNumber: string
  amount: string
  date: string
  timestamp?: string
}

export function RecentInvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])

  const loadInvoices = async () => {
    const invoicesCollection = collection(db, "invoices")
    const invoiceSnapshot = await getDocs(invoicesCollection)
    const invoiceList = invoiceSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      timestamp: doc.data().timestamp || new Date().toISOString() // Add a timestamp if not exists
    })) as Invoice[]
    setInvoices(invoiceList)
  }

  useEffect(() => {
    loadInvoices()

    const handleInvoicesUpdated = () => {
      loadInvoices()
    }

    window.addEventListener("invoicesUpdated", handleInvoicesUpdated)

    return () => {
      window.removeEventListener("invoicesUpdated", handleInvoicesUpdated)
    }
  }, [])

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-white/70 text-center py-4">No invoices yet. Upload an invoice to get started.</p>
        ) : (
          <ul className="space-y-3">
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">{invoice.invoiceNumber}</p>
                  <p className="text-white/70 text-sm">
                    {invoice.buyerName} • {invoice.amount}
                  </p>
                  <p className="text-white/50 text-xs mt-1">
                    {invoice.date} •{" "}
                    {invoice.timestamp
                      ? formatDistanceToNow(new Date(invoice.timestamp), { addSuffix: true })
                      : "Unknown time"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}