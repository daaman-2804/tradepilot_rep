"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { ArrowUpRight, DollarSign, FileText, TrendingUp } from "lucide-react"

type Invoice = {
  id: string
  buyerName: string
  invoiceNumber: string
  amount: string
  date: string
  timestamp: string
}

export function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [averageAmount, setAverageAmount] = useState(0)
  const [monthlyData, setMonthlyData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Invoice Amount",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  })

  useEffect(() => {
    // Load invoices from localStorage
    const loadInvoices = () => {
      const savedInvoices = localStorage.getItem("invoices")
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices)
        setInvoices(parsedInvoices)

        // Calculate total amount
        let total = 0
        parsedInvoices.forEach((invoice: Invoice) => {
          const amount = Number.parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""))
          if (!isNaN(amount)) {
            total += amount
          }
        })

        setTotalAmount(total)
        setAverageAmount(parsedInvoices.length > 0 ? total / parsedInvoices.length : 0)

        // Update chart data
        updateChartData(parsedInvoices)
      }
    }

    // Update chart data based on invoices
    const updateChartData = (invoices: Invoice[]) => {
      // Create a map of months to total amounts
      const monthlyAmounts = new Map<number, number>()

      invoices.forEach((invoice) => {
        try {
          const date = new Date(invoice.date)
          const month = date.getMonth()
          const amount = Number.parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""))

          if (!isNaN(month) && !isNaN(amount)) {
            const currentAmount = monthlyAmounts.get(month) || 0
            monthlyAmounts.set(month, currentAmount + amount)
          }
        } catch (error) {
          console.error("Error parsing date or amount:", error)
        }
      })

      // Create chart data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const data = Array(12).fill(0)

      monthlyAmounts.forEach((amount, month) => {
        data[month] = amount
      })

      setMonthlyData({
        labels: months,
        datasets: [
          {
            label: "Invoice Amount",
            data,
            backgroundColor: "rgba(59, 130, 246, 0.5)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
          },
        ],
      })
    }

    // Load invoices initially
    loadInvoices()

    // Set up event listener for invoice updates
    const handleInvoicesUpdated = () => {
      loadInvoices()
    }

    window.addEventListener("invoicesUpdated", handleInvoicesUpdated)

    // Clean up event listener
    return () => {
      window.removeEventListener("invoicesUpdated", handleInvoicesUpdated)
    }
  }, [])

  // Sample data for charts that doesn't change
  const vendorData = {
    labels: ["Office Supplies", "Tech Hardware", "Marketing", "Consulting", "Logistics"],
    datasets: [
      {
        label: "Spending by Vendor",
        data: [1250, 3750, 2100, 5000, 1875],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const trendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Invoice Trend",
        data: [1200, 1900, 1700, 2300, 2100, 2800],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{invoices.length}</div>
            <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+{Math.max(1, Math.floor(invoices.length * 0.1))}</span> this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+20.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Average Invoice</CardTitle>
            <DollarSign className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${averageAmount.toFixed(2)}</div>
            <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+5.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Processing Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">98.3%</div>
            <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-400" />
              <span className="text-green-400">+2.4%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Monthly Invoice Amounts</CardTitle>
            <CardDescription className="text-white/70">Total invoice amounts processed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={monthlyData}
              className="aspect-[2/1]"
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                  x: {
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Spending by Vendor</CardTitle>
            <CardDescription className="text-white/70">Distribution of spending across vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={vendorData}
              className="aspect-square"
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Invoice Trend</CardTitle>
            <CardDescription className="text-white/70">Weekly invoice processing trend</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={trendData}
              className="aspect-[2/1]"
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                  x: {
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                },
                plugins: {
                  legend: {
                    labels: {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

