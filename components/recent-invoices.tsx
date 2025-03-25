import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RecentInvoices() {
  const invoices = [
    {
      id: "INV-001",
      vendor: "Office Supplies Co.",
      amount: "$1,250.00",
      date: "Feb 15, 2024",
      status: "Processed",
    },
    {
      id: "INV-002",
      vendor: "Tech Hardware Inc.",
      amount: "$3,750.50",
      date: "Feb 10, 2024",
      status: "Processed",
    },
    {
      id: "INV-003",
      vendor: "Marketing Services Ltd.",
      amount: "$2,100.00",
      date: "Feb 5, 2024",
      status: "Pending",
    },
    {
      id: "INV-004",
      vendor: "Consulting Group",
      amount: "$5,000.00",
      date: "Jan 28, 2024",
      status: "Processed",
    },
    {
      id: "INV-005",
      vendor: "Logistics Partners",
      amount: "$1,875.25",
      date: "Jan 20, 2024",
      status: "Pending",
    },
  ]

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>View and manage recently processed invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.vendor}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "Processed" ? "default" : "secondary"}>{invoice.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

