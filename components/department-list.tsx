"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/firebase"
import { collection, getDocs, addDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type Department = {
  id: string
  name: string
  description: string
  employeeCount: number
  budget: string
  manager: string
  color: string
}

type DepartmentListProps = {
  onSelectDepartment: (departmentId: string) => void
  selectedDepartmentId: string | null
}

export function DepartmentList({ onSelectDepartment, selectedDepartmentId }: DepartmentListProps) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false)
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    budget: "",
    manager: "",
  })

  useEffect(() => {
    const loadDepartments = async () => {
      const departmentsCollection = collection(db, "departments")
      const departmentSnapshot = await getDocs(departmentsCollection)
      const departmentList = departmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Department[]
      setDepartments(departmentList)

      // Select the first department if none is selected
      if (departmentList.length > 0 && !selectedDepartmentId) {
        onSelectDepartment(departmentList[0].id)
      }
    }

    loadDepartments()
  }, [onSelectDepartment, selectedDepartmentId])

  const handleAddDepartment = async () => {
    // Generate a random color for the new department
    const colors = ["blue", "green", "purple", "orange", "pink", "teal", "indigo", "red"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    // Create a new department object
    const newDepartmentData: Department = {
      id: `dept-${Date.now()}`,
      name: newDepartment.name,
      description: newDepartment.description,
      employeeCount: 0,
      budget: newDepartment.budget.startsWith("$") ? newDepartment.budget : `$${newDepartment.budget}`,
      manager: newDepartment.manager,
      color: randomColor,
    }

    // Add new department to Firestore
    await addDoc(collection(db, "departments"), newDepartmentData)

    // Notify components of the update
    window.dispatchEvent(new Event("departmentsUpdated"))

    // Close the modal
    setShowAddDepartmentModal(false)

    // Reset form
    setNewDepartment({
      name: "",
      description: "",
      budget: "",
      manager: "",
    })

    // Select the new department
    onSelectDepartment(newDepartmentData.id)
  }

  const filteredDepartments = searchTerm
    ? departments.filter((dept) => dept.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : departments

  // Function to get badge color based on department color
  const getBadgeColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500/20 text-blue-200",
      green: "bg-green-500/20 text-green-200",
      purple: "bg-purple-500/20 text-purple-200",
      orange: "bg-orange-500/20 text-orange-200",
      pink: "bg-pink-500/20 text-pink-200",
      teal: "bg-teal-500/20 text-teal-200",
      indigo: "bg-indigo-500/20 text-indigo-200",
      red: "bg-red-500/20 text-red-200",
    }
    return colorMap[color] || "bg-blue-500/20 text-blue-200"
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white text-lg">Departments</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
            onClick={() => setShowAddDepartmentModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Department</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              type="search"
              placeholder="Search departments..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredDepartments.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/70">No departments found</p>
              <p className="text-white/50 text-sm mt-1">Add a department to get started</p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredDepartments.map((department) => (
                <li
                  key={department.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDepartmentId === department.id
                      ? "bg-blue-600/30 border border-blue-400/30"
                      : "hover:bg-white/5 border border-white/10"
                  }`}
                  onClick={() => onSelectDepartment(department.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 rounded-full p-2">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{department.name}</p>
                        <p className="text-sm text-white/70 line-clamp-1">{department.description}</p>
                      </div>
                    </div>
                    <Badge className={getBadgeColor(department.color)}>
                      {department.employeeCount} {department.employeeCount === 1 ? "employee" : "employees"}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Add Department Modal */}
      <Dialog open={showAddDepartmentModal} onOpenChange={setShowAddDepartmentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Enter the department details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAddDepartment()
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  Budget
                </Label>
                <Input
                  id="budget"
                  value={newDepartment.budget}
                  onChange={(e) => setNewDepartment({ ...newDepartment, budget: e.target.value })}
                  className="col-span-3"
                  placeholder="$100,000"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="manager" className="text-right">
                  Manager
                </Label>
                <Input
                  id="manager"
                  value={newDepartment.manager}
                  onChange={(e) => setNewDepartment({ ...newDepartment, manager: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Department</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

