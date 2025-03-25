import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function FinancialSummary() {
  const financialData = [
    {
      category: "Revenue",
      thisMonth: "$125,430",
      lastMonth: "$110,230",
      change: "+13.8%",
    },
    {
      category: "Expenses",
      thisMonth: "$54,230",
      lastMonth: "$50,120",
      change: "+8.2%",
    },
    {
      category: "Profit",
      thisMonth: "$71,200",
      lastMonth: "$60,110",
      change: "+18.5%",
    },
    {
      category: "Outstanding Invoices",
      thisMonth: "$23,500",
      lastMonth: "$18,340",
      change: "+28.1%",
    },
    {
      category: "Employee Costs",
      thisMonth: "$42,350",
      lastMonth: "$40,100",
      change: "+5.6%",
    },
  ]

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>Overview of your company's financial performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>This Month</TableHead>
              <TableHead>Last Month</TableHead>
              <TableHead>Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {financialData.map((item) => (
              <TableRow key={item.category}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell>{item.thisMonth}</TableCell>
                <TableCell>{item.lastMonth}</TableCell>
                <TableCell className="text-green-500">{item.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

