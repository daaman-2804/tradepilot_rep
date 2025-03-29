"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Box, ChevronDown, Plus, Search, SlidersHorizontal } from "lucide-react"
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
import { db, auth } from "@/src/firebase"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

// Define the expected type for an employee
type Employee = {
  id: string;
  name: string;
  avatar: string;
  title: string;
  department: string;
  location: string;
  flag: string;
  salary: string;
  startDate: string;
  lifecycle: string;
  status: string;
}

export function PeoplePageExact() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Form state for new employee
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    title: "",
    department: "Product",
    location: "",
    salary: "",
  })

  // Add state for employees
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        loadEmployees(user.uid)
      }
    })

    return () => unsubscribe()
  }, [])

  const loadEmployees = async (userId: string) => {
    if (!userId) return

    try {
      const employeesCollection = collection(db, `users/${userId}/employees`)
      const employeeSnapshot = await getDocs(employeesCollection)
      const employeeList = employeeSnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Employee, 'id'>; 
        return { id: doc.id, ...data } as Employee;
      });
      setEmployees(employeeList)
    } catch (error) {
      console.error("Error loading employees:", error)
    }
  }

  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const isRowSelected = (id: string) => selectedRows.includes(id)

  const handleExport = () => {
    const headers = ["Name", "Job Title", "Department", "Location", "Salary", "Start Date", "Lifecycle", "Status"]
    const csvContent = [
      headers.join(","),
      ...employees.map((emp: Employee) =>
        [emp.name, emp.title, emp.department, emp.location, emp.salary, emp.startDate, emp.lifecycle, emp.status].join(
          ",",
        ),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "employees.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      alert("You must be logged in to add an employee")
      return
    }

    const newEmployeeData: Omit<Employee, 'id'> = {
      name: newEmployee.name,
      avatar: "/placeholder.svg?height=40&width=40",
      title: newEmployee.title,
      department: newEmployee.department,
      location: newEmployee.location,
      flag: "🌎", // Default flag
      salary: newEmployee.salary.startsWith("$") ? newEmployee.salary : `$${newEmployee.salary}`,
      startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lifecycle: "Hired",
      status: "Invited",
    }

    try {
      // Add new employee to user-specific collection
      const userEmployeesCollection = collection(db, `users/${currentUser.uid}/employees`)
      await addDoc(userEmployeesCollection, newEmployeeData)

      // Reload employees to reflect the new addition
      loadEmployees(currentUser.uid)

      // Close the modal and reset form
      setShowAddEmployeeModal(false)
      setNewEmployee({ name: "", title: "", department: "Product", location: "", salary: "" })
    } catch (error) {
      console.error("Error adding employee:", error)
      alert("Failed to add employee")
    }
  }

  const filteredEmployees = searchTerm
    ? employees.filter((emp: Employee) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
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
              className="text-sm font-medium transition-colors hover:text-gray-900 bg-gray-900 text-white px-3 py-1.5 rounded-full"
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
        <h1 className="text-5xl font-semibold text-white mb-6">People</h1>

        {/* Main Card Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 overflow-hidden">
          {/* Metrics */}
          <div className="p-6">
            <div className="flex items-center justify-between space-x-16">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Interviews</span>
                  <span className="font-medium text-white">25%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: "25%" }}></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Hired</span>
                  <span className="font-medium text-white">51%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: "51%" }}></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Project time</span>
                  <span className="font-medium text-white">10%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/40 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Output</span>
                  <span className="font-medium text-white">14%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/40 rounded-full" style={{ width: "14%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/20">
            {/* Filters Row */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Select defaultValue="columns">
                  <SelectTrigger className="w-[130px] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="columns">Columns</SelectItem>
                    <SelectItem value="all">All Columns</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="department">
                  <SelectTrigger className="w-[130px] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="site">
                  <SelectTrigger className="w-[130px] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="all">All Sites</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="status">
                  <SelectTrigger className="w-[130px] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="entity">
                  <SelectTrigger className="w-[130px] bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entity">Entity</SelectItem>
                    <SelectItem value="all">All Entities</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    type="search"
                    placeholder="Search"
                    className="pl-10 w-[300px] bg-white/10 border-white/20 text-white placeholder-white/60"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setShowAddEmployeeModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  onClick={handleExport}
                >
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
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <div className="flex items-center">
                      Job title
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <div className="flex items-center">
                      Department
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <div className="flex items-center">
                      Site
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <div className="flex items-center">
                      Salary
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <div className="flex items-center">
                      Start date
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">
                    <div className="flex items-center">
                      Lifecycle
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/80">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className={`border-b border-white/20 ${
                      isRowSelected(employee.id) ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                    onClick={() => toggleRowSelection(employee.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-white">{employee.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/80">{employee.title}</td>
                    <td className="px-4 py-3 text-white/80">{employee.department}</td>
                    <td className="px-4 py-3 text-white/80">
                      <div className="flex items-center">
                        <span className="mr-2">{employee.flag}</span>
                        <span>{employee.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/80">{employee.salary}</td>
                    <td className="px-4 py-3 text-white/80">{employee.startDate}</td>
                    <td className="px-4 py-3 text-white/80">{employee.lifecycle}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={employee.status === "Invited" ? "outline" : "secondary"}
                        className={
                          employee.status === "Invited"
                            ? "bg-green-400/20 text-green-100 border-green-400/40"
                            : "bg-white/20 text-white/80"
                        }
                      >
                        {employee.status === "Invited" && (
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-400 inline-block"></span>
                        )}
                        {employee.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Employee Modal */}
      <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter the details of the new employee. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEmployee}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
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
                  value={newEmployee.title}
                  onChange={(e) => setNewEmployee({ ...newEmployee, title: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={newEmployee.location}
                  onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
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
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Employee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}