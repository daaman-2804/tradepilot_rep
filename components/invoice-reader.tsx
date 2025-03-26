"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { createWorker } from "tesseract.js"
import { saveUserData } from "@/src/firestore" // Import Firestore function
import { collection, addDoc } from "firebase/firestore" // Add Firestore imports
import { db } from "@/src/firebase"
import { Client } from "@/components/client-details" // Adjust the path if necessary
import { getAuth, onAuthStateChanged } from "firebase/auth" // Add this import


export function InvoiceReader() {
  const [mounted, setMounted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null) // Add user state

  useEffect(() => {
    const auth = getAuth()
    
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    setMounted(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
      setIsConfirmed(false)
    }
  }

  const extractTextWithOCR = async (file: File): Promise<string> => {
    const worker = await createWorker('eng');
    try {
      const { data: { text } } = await worker.recognize(file);
      return text;
    } finally {
      await worker.terminate();
    }
  }

  const extractDataFromText = (text: string) => {
    const invoiceNumberMatch = text.match(/Invoice Number:\s*(INV-\d+)/i) || text.match(/INV-\d+/i)
    const buyerNameMatch = text.match(/Buyer Name:\s*([^\n]+)/i) || text.match(/Name:\s*([^\n]+)/i)
    const amountMatch = text.match(/Amount Due:\s*\$?([\d,]+(?:\.\d{2})?)/i) || text.match(/\$\s*([\d,]+(?:\.\d{2})?)/i)
    const dateMatch =
      text.match(
        /Date:\s*((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})/i,
      ) ||
      text.match(
        /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})/i,
      )

    // Extract shipping address if available
    const shippingAddressMatch = text.match(/Shipping Address:\s*([^\n]+(?:\n[^\n]+)*)/i)

    // Extract company name if available
    const companyMatch = text.match(/Company:\s*([^\n]+)/i) || text.match(/Organization:\s*([^\n]+)/i)

    // Extract email if available
    const emailMatch =
      text.match(/Email:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i) ||
      text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)

    // Extract phone if available
    const phoneMatch = text.match(/Phone:\s*([\d\s\-$$$$.]+)/i) || text.match(/Tel:\s*([\d\s\-$$$$.]+)/i)

    return {
      buyerName: buyerNameMatch ? buyerNameMatch[1].trim() : "Unknown",
      invoiceNumber: invoiceNumberMatch ? invoiceNumberMatch[1].trim() : "Unknown",
      amount: amountMatch ? `$${amountMatch[1]}` : "Unknown",
      date: dateMatch ? dateMatch[1].trim() : "Unknown",
      shippingAddress: shippingAddressMatch ? shippingAddressMatch[1].trim() : "",
      company: companyMatch ? companyMatch[1].trim() : "",
      email: emailMatch ? emailMatch[1].trim() : "",
      phone: phoneMatch ? phoneMatch[1].trim() : "",
      rawText: text,
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsProcessing(true)
    setError(null)
    setIsConfirmed(false)

    try {
      const text = await extractTextWithOCR(file)

      if (!text || text.trim().length < 10) {
        throw new Error("Could not extract meaningful text from the file")
      }

      const data = extractDataFromText(text)
      setExtractedData(data)
    } catch (error) {
      console.error("Error processing file:", error)
      setError(`Error processing file: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirm = async () => {
    if (extractedData && currentUser) {
      const newInvoice = {
        ...extractedData,
        userId: currentUser.uid, // Add user ID to the invoice
        id: Date.now().toString(),
        timestamp: new Date().toISOString(), // Ensure timestamp is stored
        date: extractedData.date, // Add date field for display
      };

      try {
        // Save to a user-specific subcollection
        await addDoc(collection(db, "users", currentUser.uid, "invoices"), newInvoice);

        // Dispatch event to update invoices
        window.dispatchEvent(new Event("invoicesUpdated"));
        setIsConfirmed(true);
      } catch (error) {
        console.error("Error saving invoice:", error);
        setError("Failed to save invoice");
      }
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    console.log("Add Client Button Clicked");
    // ... rest of the code
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Upload Invoice Image</CardTitle>
          <CardDescription className="text-white/70">
            Upload an image of your invoice to automatically extract its data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="invoice-upload" className="flex-shrink-0 text-white">
                Choose file
              </Label>
              <Input
                id="invoice-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-white/10 border-white/20 text-white"
                suppressHydrationWarning
              />
            </div>
            <Button
              onClick={handleUpload}
              disabled={!file || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
              suppressHydrationWarning
            >
              {isProcessing ? "Processing..." : "Upload and Process"}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
            {error && <p className="text-red-300 text-sm mt-2">{error}</p>}
          </div>
        </CardContent>
      </Card>

      {extractedData && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Extracted Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/80">Buyer Name</p>
                <p className="text-white">{extractedData.buyerName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/80">Invoice Number</p>
                <p className="text-white">{extractedData.invoiceNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/80">Amount</p>
                <p className="text-white">{extractedData.amount}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/80">Date</p>
                <p className="text-white">{extractedData.date}</p>
              </div>

              {extractedData.company && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/80">Company</p>
                  <p className="text-white">{extractedData.company}</p>
                </div>
              )}

              {extractedData.email && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/80">Email</p>
                  <p className="text-white">{extractedData.email}</p>
                </div>
              )}

              {extractedData.phone && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white/80">Phone</p>
                  <p className="text-white">{extractedData.phone}</p>
                </div>
              )}

              {extractedData.shippingAddress && (
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium text-white/80">Shipping Address</p>
                  <p className="text-white">{extractedData.shippingAddress}</p>
                </div>
              )}
            </div>

            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-white/80">View Raw Text</summary>
              <pre className="mt-2 p-4 bg-white/5 rounded-md whitespace-pre-wrap text-sm max-h-60 overflow-y-auto text-white/70">
                {extractedData.rawText}
              </pre>
            </details>

            <Button
              onClick={handleConfirm}
              disabled={isConfirmed}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
            >
              {isConfirmed ? "Confirmed" : "Confirm and Update Dashboard"}
              <Check className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
