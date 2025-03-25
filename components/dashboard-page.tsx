"use client"

import { useEffect, useState } from "react"
import { Box, ArrowUpRight, DollarSign, Users, FileText, Building, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type DashboardData = {
  totalRevenue: number
  totalInvoices: number
  totalClients: number
  totalEmployees: number
  recentInvoices: any[]
  recentClients: any[]
  monthlyRevenue: number[]
  categoryData: {
    labels: string[]
    data: number[]
  }
}

export function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    totalInvoices: 0,
    totalClients: 0,
    totalEmployees: 6, // Default from our existing data
    recentInvoices: [],
    recentClients: [],
    monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    categoryData: {
      labels: ["Products", "Services", "Subscriptions", "Support", "Other"],
      data: [0, 0, 0, 0, 0],
    },
  })

  useEffect(() => {
    // Load data from localStorage
    const loadDashboardData = () => {
      // Get invoices
      const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")

      // Get clients
      const clients = JSON.parse(localStorage.getItem("clients") || "[]")

      // Get employees
      const employees = JSON.parse(localStorage.getItem("employees") || "[]")
      const totalEmployees = employees.length > 0 ? employees.length : 6 // Use default if no employees

      // Calculate total revenue
      let totalRevenue = 0
      invoices.forEach((invoice: any) => {
        const amount = Number.parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""))
        if (!isNaN(amount)) {
          totalRevenue += amount
        }
      })

      // Calculate monthly revenue
      const monthlyRevenue = Array(12).fill(0)
      invoices.forEach((invoice: any) => {
        try {
          const date = new Date(invoice.date)
          const month = date.getMonth()
          const amount = Number.parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""))

          if (!isNaN(month) && !isNaN(amount)) {
            monthlyRevenue[month] += amount
          }
        } catch (error) {
          console.error("Error parsing date or amount:", error)
        }
      })

      // Generate category data
      const categories = ["Products", "Services", "Subscriptions", "Support", "Other"]
      const categoryData = {
        labels: categories,
        data: categories.map(() => Math.floor(Math.random() * 5000) + 1000),
      }

      // Update dashboard data
      setDashboardData({
        totalRevenue,
        totalInvoices: invoices.length,
        totalClients: clients.length,
        totalEmployees,
        recentInvoices: invoices.slice(0, 5),
        recentClients: clients.slice(0, 5),
        monthlyRevenue,
        categoryData,
      })
    }

    // Load data initially
    loadDashboardData()

    // Set up event listeners for updates
    const handleDataUpdated = () => {
      loadDashboardData()
    }

    window.addEventListener("invoicesUpdated", handleDataUpdated)
    window.addEventListener("clientsUpdated", handleDataUpdated)
    window.addEventListener("employeesUpdated", handleDataUpdated)

    // Clean up event listeners
    return () => {
      window.removeEventListener("invoicesUpdated", handleDataUpdated)
      window.removeEventListener("clientsUpdated", handleDataUpdated)
      window.removeEventListener("employeesUpdated", handleDataUpdated)
    }
  }, [])

  // Prepare chart data
  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: dashboardData.monthlyRevenue,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  }

  const categoryChartData = {
    labels: dashboardData.categoryData.labels,
    datasets: [
      {
        label: "Revenue by Category",
        data: dashboardData.categoryData.data,
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

  const growthChartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Client Growth",
        data: [1, 2, 3, 5, 8, dashboardData.totalClients],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1565C0] to-[#E3F2FD]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100/80">
            <Box className="h-6 w-6" />
            <span className="font-bold text-xl">TradePilot</span>
          </div>
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium transition-colors hover:text-gray-900 bg-gray-900 text-white px-3 py-1.5 rounded-full"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/employees"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              People
            </Link>
            <Link
              href="/admin/departments"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Departments
            </Link>
            <Link
              href="/admin/salary"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Salary
            </Link>
            <Link
              href="/admin/projects"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Projects
            </Link>
            <Link
              href="/admin/invoices"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Invoices
            </Link>
            <Link
              href="/admin/clients"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Clients
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>TP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-5xl font-semibold text-white mb-6">Dashboard</h1>

        {/* Main Card Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 overflow-hidden p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white/10 text-white">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-white/60" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${dashboardData.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">+20.1%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Invoices</CardTitle>
                    <FileText className="h-4 w-4 text-white/60" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardData.totalInvoices}</div>
                    <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">
                        +{Math.max(1, Math.floor(dashboardData.totalInvoices * 0.1))}
                      </span>{" "}
                      this week
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Clients</CardTitle>
                    <Building className="h-4 w-4 text-white/60" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardData.totalClients}</div>
                    <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">
                        +{Math.max(1, Math.floor(dashboardData.totalClients * 0.1))}
                      </span>{" "}
                      new clients
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Employees</CardTitle>
                    <Users className="h-4 w-4 text-white/60" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{dashboardData.totalEmployees}</div>
                    <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">+2</span> since last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Overview</CardTitle>
                    <CardDescription className="text-white/70">Monthly revenue from all sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      data={revenueChartData}
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
                    <CardTitle className="text-white">Revenue by Category</CardTitle>
                    <CardDescription className="text-white/70">Distribution across business categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChart
                      data={categoryChartData}
                      className="aspect-[2/1]"
                      options={{
                        plugins: {
                          legend: {
                            position: "right",
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

              {/* Recent Activity */}
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Invoices</CardTitle>
                    <CardDescription className="text-white/70">Latest processed invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.recentInvoices.length === 0 ? (
                      <div className="text-center py-6">
                        <FileText className="h-10 w-10 text-white/40 mx-auto mb-2" />
                        <p className="text-white/70">No invoices yet</p>
                        <p className="text-white/50 text-sm">Upload invoices to see them here</p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {dashboardData.recentInvoices.map((invoice) => (
                          <li
                            key={invoice.id}
                            className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-white/10"
                          >
                            <div>
                              <p className="text-white font-medium">{invoice.invoiceNumber}</p>
                              <p className="text-white/70 text-sm">
                                {invoice.buyerName} • {invoice.amount}
                              </p>
                            </div>
                            <p className="text-white/50 text-sm">{invoice.date}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Clients</CardTitle>
                    <CardDescription className="text-white/70">Latest added clients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dashboardData.recentClients.length === 0 ? (
                      <div className="text-center py-6">
                        <Building className="h-10 w-10 text-white/40 mx-auto mb-2" />
                        <p className="text-white/70">No clients yet</p>
                        <p className="text-white/50 text-sm">Add clients to see them here</p>
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {dashboardData.recentClients.map((client) => (
                          <li
                            key={client.id}
                            className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-white/10 rounded-full p-2">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium">{client.name}</p>
                                <p className="text-white/70 text-sm">{client.company}</p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 text-white hover:bg-white/20 hover:text-white"
                            >
                              View
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white">Client Growth</CardTitle>
                    <CardDescription className="text-white/70">Weekly client acquisition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChart
                      data={growthChartData}
                      className="aspect-[3/1]"
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
                    <CardTitle className="text-white">Performance Metrics</CardTitle>
                    <CardDescription className="text-white/70">Key business indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Revenue Target</span>
                          <span className="text-sm font-medium text-white">75%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Client Retention</span>
                          <span className="text-sm font-medium text-white">92%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Invoice Processing</span>
                          <span className="text-sm font-medium text-white">
                            {dashboardData.totalInvoices > 0 ? "100%" : "0%"}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full"
                            style={{ width: dashboardData.totalInvoices > 0 ? "100%" : "0%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Employee Productivity</span>
                          <span className="text-sm font-medium text-white">83%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: "83%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Business Health</CardTitle>
                    <CardDescription className="text-white/70">Overall company status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="relative w-40 h-40">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-white/10"
                            strokeWidth="10"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-blue-400"
                            strokeWidth="10"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 * (1 - 0.85)}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-white">85%</p>
                            <p className="text-sm text-white/70">Excellent</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-white font-medium">Business Health Score</p>
                        <p className="text-white/70 text-sm">Based on revenue, clients, and operations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <TrendingUp className="h-16 w-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">Reports Coming Soon</h3>
                  <p className="text-white/70 max-w-md">
                    Detailed reports with custom date ranges and export options will be available in the next update.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

