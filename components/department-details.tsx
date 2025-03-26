"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, DollarSign, UserPlus, Trash2, Search, Edit, PieChart, BarChartIcon } from "lucide-react"
import { BarChart, PieChart as PieChartComponent } from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { db } from "@/src/firebase"
import { doc, getDoc } from "firebase/firestore"

type Department = {
  id: string
  name: string
  description: string
  employeeCount: number
  budget: string
  manager: string
  color: string
}

type Employee = {
  id: number
  name: string
  avatar: string
  title: string
  department: string
  location: string
  salary: string
  startDate: string
  status: string
}

type DepartmentDetailsProps = {
  departmentId: string | null
}

export function DepartmentDetails({ departmentId }: DepartmentDetailsProps) {
  const [department, setDepartment] = useState<Department | null>(null)
  const [departmentEmployees, setDepartmentEmployees] = useState<Employee[]>([])
  const [allEmployees, setAllEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false)
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showDeleteDepartmentDialog, setShowDeleteDepartmentDialog] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null)

  const [editDepartment, setEditDepartment] = useState({
    name: "",
    description: "",
    budget: "",
    manager: "",
  })

  useEffect(() => {
    const loadDepartment = async () => {
      if (!departmentId) return

      const departmentDoc = doc(db, "departments", departmentId)
      const departmentSnapshot = await getDoc(departmentDoc)

      if (departmentSnapshot.exists()) {
        setDepartment({ id: departmentSnapshot.id, ...departmentSnapshot.data() } as Department)
        setEditDepartment({
          name: departmentSnapshot.data().name,
          description: departmentSnapshot.data().description,
          budget: departmentSnapshot.data().budget,
          manager: departmentSnapshot.data().manager,
        })

        // Load all employees
        const allEmployeesData = JSON.parse(localStorage.getItem("employees") || "[]")
        setAllEmployees(allEmployeesData)

        // Filter employees for this department
        const departmentEmployeesData = allEmployeesData.filter(
          (employee: Employee) => employee.department === departmentSnapshot.data().name,
        )
        setDepartmentEmployees(departmentEmployeesData)
      } else {
        console.error("No such document!")
      }
    }

    loadDepartment()
  }, [departmentId])

  // Initialize with sample employees if none exist
  useEffect(() => {
    const existingEmployees = JSON.parse(localStorage.getItem("employees") || "[]")

    if (existingEmployees.length === 0) {
      const sampleEmployees = [
        {
          id: 1,
          name: "Anatoly Belik",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Head of Design",
          department: "Unassigned",
          location: "Stockholm",
          salary: "$1,350",
          startDate: "Mar 13, 2023",
          status: "Active",
        },
        {
          id: 2,
          name: "Ksenia Bator",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Fullstack Engineer",
          department: "Unassigned",
          location: "Miami",
          salary: "$1,500",
          startDate: "Oct 13, 2023",
          status: "Active",
        },
        {
          id: 3,
          name: "Bogdan Nikitin",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Mobile Lead",
          department: "Unassigned",
          location: "Kyiv",
          salary: "$2,600",
          startDate: "Nov 4, 2023",
          status: "Active",
        },
        {
          id: 4,
          name: "Arsen Yatsenko",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Sales Manager",
          department: "Unassigned",
          location: "Ottawa",
          salary: "$900",
          startDate: "Sep 4, 2021",
          status: "Active",
        },
        {
          id: 5,
          name: "Daria Yurchenko",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Network Engineer",
          department: "Unassigned",
          location: "Sao Paulo",
          salary: "$1,000",
          startDate: "Feb 21, 2023",
          status: "Active",
        },
      ]

      localStorage.setItem("employees", JSON.stringify(sampleEmployees))
      setAllEmployees(sampleEmployees)
    }
  }, [])

  const handleEditDepartment = () => {
    if (!department) return

    // Get all departments
    const departments = JSON.parse(localStorage.getItem("departments") || "[]")

    // Find and update the current department
    const updatedDepartments = departments.map((dept: Department) => {
      if (dept.id === department.id) {
        return {
          ...dept,
          name: editDepartment.name,
          description: editDepartment.description,
          budget: editDepartment.budget.startsWith("$") ? editDepartment.budget : `$${editDepartment.budget}`,
          manager: editDepartment.manager,
        }
      }
      return dept
    })

    // Save updated departments
    localStorage.setItem("departments", JSON.stringify(updatedDepartments))

    // Update employees if department name changed
    if (editDepartment.name !== department.name) {
      const allEmployeesData = JSON.parse(localStorage.getItem("employees") || "[]")
      const updatedEmployees = allEmployeesData.map((employee: Employee) => {
        if (employee.department === department.name) {
          return {
            ...employee,
            department: editDepartment.name,
          }
        }
        return employee
      })
      localStorage.setItem("employees", JSON.stringify(updatedEmployees))
    }

    // Notify components of the update
    window.dispatchEvent(new Event("departmentsUpdated"))

    // Close the modal
    setShowEditDepartmentModal(false)
  }

  const handleDeleteDepartment = () => {
    if (!department) return

    // Get all departments
    const departments = JSON.parse(localStorage.getItem("departments") || "[]")

    // Filter out the current department
    const updatedDepartments = departments.filter((dept: Department) => dept.id !== department.id)

    // Save updated departments
    localStorage.setItem("departments", JSON.stringify(updatedDepartments))

    // Update employees to "Unassigned" department
    const allEmployeesData = JSON.parse(localStorage.getItem("employees") || "[]")
    const updatedEmployees = allEmployeesData.map((employee: Employee) => {
      if (employee.department === department.name) {
        return {
          ...employee,
          department: "Unassigned",
        }
      }
      return employee
    })
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))

    // Notify components of the update
    window.dispatchEvent(new Event("departmentsUpdated"))

    // Close the dialog
    setShowDeleteDepartmentDialog(false)
  }

  const handleAddEmployeeToDepartment = (employeeId: number) => {
    if (!department) return

    // Get all employees
    const allEmployeesData = JSON.parse(localStorage.getItem("employees") || "[]")

    // Find and update the selected employee
    const updatedEmployees = allEmployeesData.map((employee: Employee) => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          department: department.name,
        }
      }
      return employee
    })

    // Save updated employees
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))

    // Update department employee count
    const departments = JSON.parse(localStorage.getItem("departments") || "[]")
    const updatedDepartments = departments.map((dept: Department) => {
      if (dept.id === department.id) {
        return {
          ...dept,
          employeeCount: dept.employeeCount + 1,
        }
      }
      return dept
    })
    localStorage.setItem("departments", JSON.stringify(updatedDepartments))

    // Update local state
    setDepartmentEmployees(updatedEmployees.filter((employee: Employee) => employee.department === department.name))
    setDepartment({
      ...department,
      employeeCount: department.employeeCount + 1,
    })

    // Notify components of the updates
    window.dispatchEvent(new Event("departmentsUpdated"))
    window.dispatchEvent(new Event("employeesUpdated"))

    // Close the modal and reset selection
    setShowAddEmployeeModal(false)
    setSelectedEmployeeId(null)
  }

  const handleRemoveEmployeeFromDepartment = (employeeId: number) => {
    if (!department) return

    // Get all employees
    const allEmployeesData = JSON.parse(localStorage.getItem("employees") || "[]")

    // Find and update the selected employee
    const updatedEmployees = allEmployeesData.map((employee: Employee) => {
      if (employee.id === employeeId) {
        return {
          ...employee,
          department: "Unassigned",
        }
      }
      return employee
    })

    // Save updated employees
    localStorage.setItem("employees", JSON.stringify(updatedEmployees))

    // Update department employee count
    const departments = JSON.parse(localStorage.getItem("departments") || "[]")
    const updatedDepartments = departments.map((dept: Department) => {
      if (dept.id === department.id) {
        return {
          ...dept,
          employeeCount: Math.max(0, dept.employeeCount - 1),
        }
      }
      return dept
    })
    localStorage.setItem("departments", JSON.stringify(updatedDepartments))

    // Notify components of the update
    window.dispatchEvent(new Event("departmentsUpdated"))
  }

  const filteredEmployees = searchTerm
    ? allEmployees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) && employee.department !== department?.name,
      )
    : allEmployees.filter((employee) => employee.department !== department?.name)

  // Prepare chart data
  const budgetAllocationData = {
    labels: ["Salaries", "Equipment", "Training", "Operations", "Miscellaneous"],
    datasets: [
      {
        label: "Budget Allocation",
        data: [40, 20, 15, 15, 10],
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

  const employeePerformanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance Score",
        data: [65, 70, 75, 80, 85, 90],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
      },
    ],
  }

  if (!department) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-white/70">Select a department to view details</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              {department.name}
              <Badge className="ml-2 bg-blue-500/20 text-blue-200">
                {department.employeeCount} {department.employeeCount === 1 ? "employee" : "employees"}
              </Badge>
            </CardTitle>
            <p className="text-white/70 mt-1">{department.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 flex items-center gap-2"
              onClick={() => setShowEditDepartmentModal(true)}
            >
              <Edit className="h-4 w-4" /> Edit Department
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-red-400/30 text-red-300 hover:bg-red-900/20 hover:text-red-200 flex items-center gap-2"
              onClick={() => setShowDeleteDepartmentDialog(true)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="bg-white/10 text-white mb-4">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                Overview
              </TabsTrigger>
              <TabsTrigger value="employees" className="data-[state=active]:bg-blue-600">
                Employees
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Department</p>
                      <p className="text-white">{department.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Manager</p>
                      <p className="text-white">{department.manager}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Budget</p>
                      <p className="text-white">{department.budget}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Employees</p>
                      <p className="text-white">{department.employeeCount}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <PieChart className="h-5 w-5 text-blue-300" />
                    <p className="text-white font-medium">Budget Allocation</p>
                  </div>
                  <PieChartComponent
                    data={budgetAllocationData}
                    className="aspect-square"
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employees">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Department Employees</h3>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 flex items-center gap-2"
                  onClick={() => setShowAddEmployeeModal(true)}
                >
                  <UserPlus className="h-4 w-4" /> Add Employee
                </Button>
              </div>

              {departmentEmployees.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                  <Users className="h-12 w-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/70">No employees in this department</p>
                  <p className="text-white/50 text-sm mt-1">Add employees to this department</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {departmentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{employee.name}</p>
                          <p className="text-sm text-white/70">{employee.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-200">{employee.salary}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/50 hover:text-red-300 hover:bg-transparent"
                          onClick={() => handleRemoveEmployeeFromDepartment(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChartIcon className="h-5 w-5 text-blue-300" />
                    <p className="text-white font-medium">Department Performance</p>
                  </div>
                  <BarChart
                    data={employeePerformanceData}
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
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-3">Department Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Budget Utilization</span>
                          <span className="text-sm font-medium text-white">78%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Project Completion</span>
                          <span className="text-sm font-medium text-white">92%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Employee Satisfaction</span>
                          <span className="text-sm font-medium text-white">85%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80">Efficiency Rating</span>
                          <span className="text-sm font-medium text-white">88%</span>
                        </div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: "88%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Department Modal */}
      <Dialog open={showEditDepartmentModal} onOpenChange={setShowEditDepartmentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>Update the department details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleEditDepartment()
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editDepartment.name}
                  onChange={(e) => setEditDepartment({ ...editDepartment, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  value={editDepartment.description}
                  onChange={(e) => setEditDepartment({ ...editDepartment, description: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-budget" className="text-right">
                  Budget
                </Label>
                <Input
                  id="edit-budget"
                  value={editDepartment.budget}
                  onChange={(e) => setEditDepartment({ ...editDepartment, budget: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-manager" className="text-right">
                  Manager
                </Label>
                <Input
                  id="edit-manager"
                  value={editDepartment.manager}
                  onChange={(e) => setEditDepartment({ ...editDepartment, manager: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Employee Modal */}
      <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Employee to Department</DialogTitle>
            <DialogDescription>Select an employee to add to this department.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No employees found</p>
                  <p className="text-muted-foreground/70 text-sm mt-1">Try a different search term</p>
                </div>
              ) : (
                filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer ${
                      selectedEmployeeId === employee.id
                        ? "bg-primary/10 border-primary/30"
                        : "hover:bg-muted/50 border-border"
                    }`}
                    onClick={() => setSelectedEmployeeId(employee.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.title}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{employee.department || "Unassigned"}</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => selectedEmployeeId && handleAddEmployeeToDepartment(selectedEmployeeId)}
              disabled={!selectedEmployeeId}
            >
              Add to Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Department Confirmation */}
      <AlertDialog open={showDeleteDepartmentDialog} onOpenChange={setShowDeleteDepartmentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the department and unassign all employees. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDepartment} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

