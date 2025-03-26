"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/src/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { getAuth, onAuthStateChanged } from "firebase/auth"

type Invoice = {
  id: string
  buyerName: string
  invoiceNumber: string
  amount: string
  date: string
  timestamp?: string
  userId?: string
}

export function RecentInvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  const loadInvoices = async (userId: string) => {
    try {
      // Create a reference to the user's invoices subcollection
      const invoicesRef = collection(db, "users", userId, "invoices")
      
      // Create a query to order invoices by timestamp
      const q = query(invoicesRef, orderBy("timestamp", "desc"))
      
      // Get the documents
      const querySnapshot = await getDocs(q)
      
      // Map the documents to invoices
      const invoiceList = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data()
      })) as Invoice[]

      setInvoices(invoiceList)
    } catch (error) {
      console.error("Error loading invoices:", error)
      setInvoices([])
    }
  }

  useEffect(() => {
    const auth = getAuth()
    
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        loadInvoices(user.uid)
      } else {
        setCurrentUser(null)
        setInvoices([])
      }
    })

    // Event listener for invoice updates
    const handleInvoicesUpdated = () => {
      if (currentUser) {
        loadInvoices(currentUser.uid)
      }
    }

    window.addEventListener("invoicesUpdated", handleInvoicesUpdated)

    // Cleanup subscriptions
    return () => {
      unsubscribe()
      window.removeEventListener("invoicesUpdated", handleInvoicesUpdated)
    }
  }, [currentUser])

  const totalInvoices = invoices.length
  const totalAmount = invoices.reduce((acc, invoice) => {
    const amount = parseFloat(invoice.amount.replace(/[$,]/g, '')) || 0; // Remove $ and commas
    return acc + amount;
  }, 0).toFixed(2); // Format to 2 decimal places

  if (!currentUser) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 text-center py-4">Please log in to view your invoices.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white/70">Total Invoices: {totalInvoices}</p>
        <p className="text-white/70">Total Amount: ${totalAmount}</p>
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