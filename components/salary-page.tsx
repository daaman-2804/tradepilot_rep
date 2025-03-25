"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Box, Plus, Search, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Employee = {
  id: number
  name: string
  avatar: string
  title: string
  department: string
  location: string
  salary: string
  hours: number
  progress: number
  email?: string
  phone?: string
  startDate?: string
  performance?: {
    efficiency: number
    quality: number
    attendance: number
    teamwork: number
  }
}

export function SalaryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddSalaryModal, setShowAddSalaryModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)

  const [newSalary, setNewSalary] = useState({
    name: "",
    title: "",
    hours: "",
    salary: "",
    department: "Product",
    location: "",
    email: "",
    phone: "",
    startDate: "",
  })

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Harry Bender",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Head of Design",
      department: "Design",
      location: "New York",
      hours: 264,
      salary: "$2,647",
      progress: 70,
      email: "harry.bender@company.com",
      phone: "+1 (555) 234-5678",
      startDate: "Mar 15, 2022",
      performance: {
        efficiency: 85,
        quality: 90,
        attendance: 95,
        teamwork: 88,
      },
    },
    {
      id: 2,
      name: "Katy Fuller",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Fullstack Engineer",
      department: "Engineering",
      location: "San Francisco",
      hours: 240,
      salary: "$2,400",
      progress: 60,
      email: "katy.fuller@company.com",
      phone: "+1 (555) 987-6543",
      startDate: "Aug 22, 2021",
      performance: {
        efficiency: 78,
        quality: 82,
        attendance: 92,
        teamwork: 90,
      },
    },
    {
      id: 3,
      name: "Jonathan Kelly",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Mobile Lead",
      department: "Engineering",
      location: "London",
      hours: 280,
      salary: "$3,100",
      progress: 85,
      email: "jonathan.kelly@company.com",
      phone: "+44 20 7946 0823",
      startDate: "Jan 05, 2023",
      performance: {
        efficiency: 92,
        quality: 88,
        attendance: 98,
        teamwork: 95,
      },
    },
    {
      id: 4,
      name: "Sarah Page",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Network Engineer",
      department: "IT",
      location: "Berlin",
      hours: 220,
      salary: "$2,200",
      progress: 55,
      email: "sarah.page@company.com",
      phone: "+49 30 26553890",
      startDate: "Nov 11, 2022",
      performance: {
        efficiency: 75,
        quality: 70,
        attendance: 85,
        teamwork: 80,
      },
    },
    {
      id: 5,
      name: "Erica Wyatt",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Head of Design",
      department: "Design",
      location: "Sydney",
      hours: 260,
      salary: "$2,800",
      progress: 65,
      email: "erica.wyatt@company.com",
      phone: "+61 2 8373 9400",
      startDate: "Apr 30, 2023",
      performance: {
        efficiency: 80,
        quality: 85,
        attendance: 90,
        teamwork: 85,
      },
    },
  ])

  const handleAddSalary = (e: React.FormEvent) => {
    e.preventDefault()

    // Format the date if it's not already formatted
    const formattedDate = newSalary.startDate.includes(",")
      ? newSalary.startDate
      : new Date(newSalary.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

    // Create a new employee object with all details
    const newEmployeeData: Employee = {
      id: employees.length + 1,
      name: newSalary.name,
      avatar: "/placeholder.svg?height=40&width=40",
      title: newSalary.title,
      department: newSalary.department,
      location: newSalary.location,
      hours: Number.parseInt(newSalary.hours),
      salary: newSalary.salary.startsWith("$") ? newSalary.salary : `$${newSalary.salary}`,
      progress: Math.floor(Math.random() * 30) + 50, // Random progress between 50-80%
      email: newSalary.email,
      phone: newSalary.phone,
      startDate: formattedDate,
      performance: {
        efficiency: Math.floor(Math.random() * 20) + 70, // Random performance between 70-90%
        quality: Math.floor(Math.random() * 20) + 70,
        attendance: Math.floor(Math.random() * 20) + 70,
        teamwork: Math.floor(Math.random() * 20) + 70,
      },
    }

    // Add the new employee to the employees array
    const updatedEmployees = [...employees, newEmployeeData]
    setEmployees(updatedEmployees)

    // Save to localStorage for persistence
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))

    // Dispatch event to notify other components
    window.dispatchEvent(new Event("employeesUpdated"))

    // Close the modal
    setShowAddSalaryModal(false)

    // Reset form
    setNewSalary({
      name: "",
      title: "",
      hours: "",
      salary: "",
      department: "Product",
      location: "",
      email: "",
      phone: "",
      startDate: "",
    })
  }

  const filteredEmployees = searchTerm
    ? employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : employees

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
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
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
              className="text-sm font-medium transition-colors hover:text-gray-900 bg-gray-900 text-white px-3 py-1.5 rounded-full"
            >
              Salary
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-semibold text-white">Salary</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
              onClick={() => setShowAddSalaryModal(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white hover:bg-white/20">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Salary List */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-white text-lg">Employees</CardTitle>
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        selectedEmployee?.id === employee.id
                          ? "bg-blue-600/30 border-blue-400/30"
                          : "border-white/10 hover:bg-white/5"
                      }`}
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setShowEmployeeDetails(true)
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{employee.name}</p>
                          <p className="text-sm text-white/70">{employee.title}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${employee.progress}%` }} />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{employee.hours} hrs</span>
                          <span className="text-white font-medium">{employee.salary}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Details */}
          <div className="lg:col-span-2">
            {showEmployeeDetails && selectedEmployee ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                      <AvatarFallback>{selectedEmployee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-white text-2xl">{selectedEmployee.name}</CardTitle>
                      <p className="text-white/70">{selectedEmployee.title}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setShowEmployeeDetails(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white/10 text-white">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
                        Performance
                      </TabsTrigger>
                      <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
                        History
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="grid gap-6 grid-cols-2">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-white/70">Department</label>
                            <p className="text-white">{selectedEmployee.department}</p>
                          </div>
                          <div>
                            <label className="text-sm text-white/70">Location</label>
                            <p className="text-white">{selectedEmployee.location}</p>
                          </div>
                          <div>
                            <label className="text-sm text-white/70">Email</label>
                            <p className="text-white">{selectedEmployee.email}</p>
                          </div>
                          <div>
                            <label className="text-sm text-white/70">Phone</label>
                            <p className="text-white">{selectedEmployee.phone}</p>
                          </div>
                          <div>
                            <label className="text-sm text-white/70">Start Date</label>
                            <p className="text-white">{selectedEmployee.startDate}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-white/70">Current Pay Period</label>
                            <div className="mt-2">
                              <div className="flex justify-between mb-1">
                                <span className="text-white">{selectedEmployee.hours} hours</span>
                                <span className="text-white">{selectedEmployee.salary}</span>
                              </div>
                              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-400 rounded-full"
                                  style={{ width: `${selectedEmployee.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-lg p-4 mt-4">
                            <h3 className="text-white font-medium mb-3">Performance Metrics</h3>
                            <div className="space-y-3">
                              {selectedEmployee.performance &&
                                Object.entries(selectedEmployee.performance).map(([key, value]) => (
                                  <div key={key}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-sm text-white/80 capitalize">{key}</span>
                                      <span className="text-sm text-white">{value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${value}%` }} />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="performance">
                      <div className="text-center py-8">
                        <p className="text-white/70">Detailed performance metrics coming soon</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="history">
                      <div className="text-center py-8">
                        <p className="text-white/70">Salary history and adjustments coming soon</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="flex items-center justify-center h-[400px]">
                  <p className="text-white/70">Select an employee to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Add Salary Modal */}
      <Dialog open={showAddSalaryModal} onOpenChange={setShowAddSalaryModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter the employee details and salary information.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSalary}>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="additional">Additional Details</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newSalary.name}
                      onChange={(e) => setNewSalary({ ...newSalary, name: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Job Title
                    </Label>
                    <Input
                      id="title"
                      value={newSalary.title}
                      onChange={(e) => setNewSalary({ ...newSalary, title: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hours" className="text-right">
                      Hours
                    </Label>
                    <Input
                      id="hours"
                      type="number"
                      value={newSalary.hours}
                      onChange={(e) => setNewSalary({ ...newSalary, hours: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="salary" className="text-right">
                      Salary
                    </Label>
                    <Input
                      id="salary"
                      value={newSalary.salary}
                      onChange={(e) => setNewSalary({ ...newSalary, salary: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">
                      Department
                    </Label>
                    <Select
                      value={newSalary.department}
                      onValueChange={(value) => setNewSalary({ ...newSalary, department: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={newSalary.location}
                      onChange={(e) => setNewSalary({ ...newSalary, location: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newSalary.email}
                      onChange={(e) => setNewSalary({ ...newSalary, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={newSalary.phone}
                      onChange={(e) => setNewSalary({ ...newSalary, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startDate" className="text-right">
                      Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newSalary.startDate}
                      onChange={(e) => setNewSalary({ ...newSalary, startDate: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Employee
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

