"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"

type ClientAnalyticsProps = {
  clientId: string | null
}

export function ClientAnalytics({ clientId }: ClientAnalyticsProps) {
  const [spendingData, setSpendingData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Spending",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  })

  const [categoryData, setCategoryData] = useState({
    labels: ["Products", "Services", "Subscriptions", "Support", "Other"],
    datasets: [
      {
        label: "Spending by Category",
        data: [0, 0, 0, 0, 0],
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
  })

  const [shipmentData, setShipmentData] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Shipment Timeline",
        data: [0, 0, 0, 0, 0, 0],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  })

  useEffect(() => {
    if (!clientId) return

    // Load client data
    const clients = JSON.parse(localStorage.getItem("clients") || "[]")
    const client = clients.find((c: any) => c.id === clientId)

    if (client) {
      // Load invoices for this client
      const allInvoices = JSON.parse(localStorage.getItem("invoices") || "[]")
      const clientInvoices = allInvoices.filter(
        (invoice: any) => invoice.buyerName.toLowerCase() === client.name.toLowerCase(),
      )

      if (clientInvoices.length > 0) {
        // Generate random spending data based on invoices
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthlySpending = Array(12).fill(0)

        clientInvoices.forEach((invoice: any) => {
          try {
            const date = new Date(invoice.date)
            const month = date.getMonth()
            const amount = Number.parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""))

            if (!isNaN(month) && !isNaN(amount)) {
              monthlySpending[month] += amount
            }
          } catch (error) {
            console.error("Error parsing date or amount:", error)
          }
        })

        setSpendingData({
          labels: months,
          datasets: [
            {
              label: "Monthly Spending",
              data: monthlySpending,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgb(59, 130, 246)",
              borderWidth: 2,
            },
          ],
        })

        // Generate random category data
        const categories = ["Products", "Services", "Subscriptions", "Support", "Other"]
        const categorySpending = categories.map(() => Math.floor(Math.random() * 5000) + 1000)

        setCategoryData({
          labels: categories,
          datasets: [
            {
              label: "Spending by Category",
              data: categorySpending,
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
        })

        // Generate random shipment timeline data
        const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]
        const shipmentTimeline = weeks.map(() => Math.floor(Math.random() * 5) + 1)

        setShipmentData({
          labels: weeks,
          datasets: [
            {
              label: "Shipment Timeline",
              data: shipmentTimeline,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        })
      }
    }
  }, [clientId])

  if (!clientId) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-white/70">Select a client to view analytics</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Client Spending History</CardTitle>
          <CardDescription className="text-white/70">Monthly spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={spendingData}
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
          <CardTitle className="text-white">Spending by Category</CardTitle>
          <CardDescription className="text-white/70">Distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <PieChart
            data={categoryData}
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
          <CardTitle className="text-white">Shipment Timeline</CardTitle>
          <CardDescription className="text-white/70">Weekly shipment activity</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart
            data={shipmentData}
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
  )
}

