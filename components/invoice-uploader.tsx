"use client"

import { useState } from "react"
import { Upload, FileText, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function InvoiceUploader() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = () => {
    setUploading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploaded(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Reader</CardTitle>
        <CardDescription>Upload invoices to automatically update your dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Uploading and processing...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : uploaded ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-2 border-2 border-dashed rounded-lg border-muted">
            <div className="bg-primary/10 p-3 rounded-full">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Invoice processed successfully</p>
              <p className="text-xs text-muted-foreground mt-1">Dashboard has been updated with the latest data</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-2 border-2 border-dashed rounded-lg border-muted">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Drag and drop your invoice</p>
              <p className="text-xs text-muted-foreground mt-1">Supports PDF, JPG, PNG formats up to 10MB</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleUpload} disabled={uploading || uploaded}>
          {uploaded ? "Uploaded" : uploading ? "Processing..." : "Upload Invoice"}
          {!uploading && !uploaded && <Upload className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}

