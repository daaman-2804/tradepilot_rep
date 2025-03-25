"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Briefcase, Plus, Calendar } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Project = {
  id: string
  name: string
  description: string
  status: "Not Started" | "In Progress" | "On Hold" | "Completed" | "Cancelled"
  priority: "Low" | "Medium" | "High" | "Urgent"
  startDate: string
  endDate: string
  budget: string
  clientId?: string
  clientName?: string
  departmentId?: string
  departmentName?: string
  progress: number
  tasks: Task[]
  teamMembers: TeamMember[]
}

type Task = {
  id: string
  title: string
  description: string
  status: "To Do" | "In Progress" | "In Review" | "Completed"
  assigneeId?: string
  assigneeName?: string
  dueDate?: string
  priority: "Low" | "Medium" | "High" | "Urgent"
}

type TeamMember = {
  id: string
  name: string
  role: string
  avatar: string
}

type ProjectListProps = {
  onSelectProject: (projectId: string) => void
  selectedProjectId: string | null
}

export function ProjectList({ onSelectProject, selectedProjectId }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "Not Started",
    priority: "Medium",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    budget: "",
    clientId: "",
    departmentId: "",
  })

  useEffect(() => {
    // Load projects from localStorage
    const loadProjects = () => {
      const savedProjects = localStorage.getItem("projects")
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects)
        setProjects(parsedProjects)

        // Select the first project if none is selected
        if (parsedProjects.length > 0 && !selectedProjectId) {
          onSelectProject(parsedProjects[0].id)
        }
      } else {
        // If no projects exist, create default ones
        const defaultProjects = [
          {
            id: "proj-1",
            name: "Website Redesign",
            description: "Complete overhaul of the company website with new branding and improved UX",
            status: "In Progress",
            priority: "High",
            startDate: "2024-01-15",
            endDate: "2024-04-30",
            budget: "$25,000",
            clientId: "client-1",
            clientName: "Acme Corporation",
            departmentId: "dept-4",
            departmentName: "Engineering",
            progress: 45,
            tasks: [
              {
                id: "task-1",
                title: "Design mockups",
                description: "Create design mockups for all main pages",
                status: "Completed",
                assigneeId: "1",
                assigneeName: "Anatoly Belik",
                dueDate: "2024-02-15",
                priority: "High",
              },
              {
                id: "task-2",
                title: "Frontend development",
                description: "Implement responsive frontend based on approved designs",
                status: "In Progress",
                assigneeId: "2",
                assigneeName: "Ksenia Bator",
                dueDate: "2024-03-30",
                priority: "High",
              },
              {
                id: "task-3",
                title: "Backend integration",
                description: "Connect frontend to CMS and other backend services",
                status: "To Do",
                assigneeId: "3",
                assigneeName: "Bogdan Nikitin",
                dueDate: "2024-04-15",
                priority: "Medium",
              },
            ],
            teamMembers: [
              {
                id: "1",
                name: "Anatoly Belik",
                role: "Lead Designer",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                id: "2",
                name: "Ksenia Bator",
                role: "Frontend Developer",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                id: "3",
                name: "Bogdan Nikitin",
                role: "Backend Developer",
                avatar: "/placeholder.svg?height=40&width=40",
              },
            ],
          },
          {
            id: "proj-2",
            name: "Mobile App Development",
            description: "Develop a new mobile app for customer engagement and loyalty program",
            status: "Not Started",
            priority: "Medium",
            startDate: "2024-04-01",
            endDate: "2024-08-31",
            budget: "$75,000",
            clientId: "client-2",
            clientName: "TechSolutions Inc.",
            departmentId: "dept-4",
            departmentName: "Engineering",
            progress: 0,
            tasks: [
              {
                id: "task-4",
                title: "Requirements gathering",
                description: "Collect and document all app requirements",
                status: "To Do",
                assigneeId: "4",
                assigneeName: "Arsen Yatsenko",
                dueDate: "2024-04-15",
                priority: "High",
              },
              {
                id: "task-5",
                title: "UI/UX design",
                description: "Create app wireframes and UI design",
                status: "To Do",
                assigneeId: "1",
                assigneeName: "Anatoly Belik",
                dueDate: "2024-05-15",
                priority: "Medium",
              },
            ],
            teamMembers: [
              {
                id: "3",
                name: "Bogdan Nikitin",
                role: "Mobile Lead",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                id: "4",
                name: "Arsen Yatsenko",
                role: "Project Manager",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                id: "1",
                name: "Anatoly Belik",
                role: "UI/UX Designer",
                avatar: "/placeholder.svg?height=40&width=40",
              },
            ],
          },
          {
            id: "proj-3",
            name: "Marketing Campaign",
            description: "Q2 marketing campaign for new product launch",
            status: "On Hold",
            priority: "Urgent",
            startDate: "2024-03-01",
            endDate: "2024-06-30",
            budget: "$35,000",
            clientId: "client-3",
            clientName: "Global Retail Ltd.",
            departmentId: "dept-3",
            departmentName: "Marketing",
            progress: 25,
            tasks: [
              {
                id: "task-6",
                title: "Campaign strategy",
                description: "Develop comprehensive marketing strategy",
                status: "Completed",
                assigneeId: "6",
                assigneeName: "Yulia Polishchuk",
                dueDate: "2024-03-15",
                priority: "Urgent",
              },
              {
                id: "task-7",
                title: "Content creation",
                description: "Create all campaign content including videos and graphics",
                status: "In Progress",
                assigneeId: "5",
                assigneeName: "Daria Yurchenko",
                dueDate: "2024-04-15",
                priority: "High",
              },
              {
                id: "task-8",
                title: "Media buying",
                description: "Secure advertising placements across channels",
                status: "On Hold",
                assigneeId: "4",
                assigneeName: "Arsen Yatsenko",
                dueDate: "2024-05-01",
                priority: "Medium",
              },
            ],
            teamMembers: [
              {
                id: "6",
                name: "Yulia Polishchuk",
                role: "Marketing Director",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                id: "5",
                name: "Daria Yurchenko",
                role: "Content Specialist",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              {
                id: "4",
                name: "Arsen Yatsenko",
                role: "Media Buyer",
                avatar: "/placeholder.svg?height=40&width=40",
              },
            ],
          },
        ]

        localStorage.setItem("projects", JSON.stringify(defaultProjects))
        setProjects(defaultProjects)
        onSelectProject(defaultProjects[0].id)
      }
    }

    // Load clients, departments, and employees
    const loadRelatedData = () => {
      const savedClients = localStorage.getItem("clients")
      if (savedClients) {
        setClients(JSON.parse(savedClients))
      }

      const savedDepartments = localStorage.getItem("departments")
      if (savedDepartments) {
        setDepartments(JSON.parse(savedDepartments))
      }

      const savedEmployees = localStorage.getItem("employees")
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees))
      }
    }

    // Load projects initially
    loadProjects()
    loadRelatedData()

    // Set up event listener for project updates
    const handleProjectsUpdated = () => {
      loadProjects()
    }

    window.addEventListener("projectsUpdated", handleProjectsUpdated)
    window.addEventListener("clientsUpdated", loadRelatedData)
    window.addEventListener("departmentsUpdated", loadRelatedData)
    window.addEventListener("employeesUpdated", loadRelatedData)

    // Clean up event listeners
    return () => {
      window.removeEventListener("projectsUpdated", handleProjectsUpdated)
      window.removeEventListener("clientsUpdated", loadRelatedData)
      window.removeEventListener("departmentsUpdated", loadRelatedData)
      window.removeEventListener("employeesUpdated", loadRelatedData)
    }
  }, [onSelectProject, selectedProjectId])

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()

    // Find client and department names
    const client = clients.find((c) => c.id === newProject.clientId)
    const department = departments.find((d) => d.id === newProject.departmentId)

    // Create a new project object
    const newProjectData: Project = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      status: newProject.status as any,
      priority: newProject.priority as any,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      budget: newProject.budget.startsWith("$") ? newProject.budget : `$${newProject.budget}`,
      clientId: newProject.clientId,
      clientName: client ? client.name : undefined,
      departmentId: newProject.departmentId,
      departmentName: department ? department.name : undefined,
      progress: 0,
      tasks: [],
      teamMembers: [],
    }

    // Get existing projects
    const existingProjects = JSON.parse(localStorage.getItem("projects") || "[]")

    // Add new project
    const updatedProjects = [...existingProjects, newProjectData]

    // Save updated projects
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Notify components of the update
    window.dispatchEvent(new Event("projectsUpdated"))

    // Close the modal
    setShowAddProjectModal(false)

    // Reset form
    setNewProject({
      name: "",
      description: "",
      status: "Not Started",
      priority: "Medium",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      budget: "",
      clientId: "",
      departmentId: "",
    })

    // Select the new project
    onSelectProject(newProjectData.id)
  }

  const filteredProjects = searchTerm
    ? projects.filter(
        (proj) =>
          proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          proj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (proj.clientName && proj.clientName.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    : projects

  // Function to get badge color based on project status
  const getStatusBadgeColor = (status: string) => {
    const statusMap: Record<string, string> = {
      "Not Started": "bg-gray-500/20 text-gray-200",
      "In Progress": "bg-blue-500/20 text-blue-200",
      "On Hold": "bg-yellow-500/20 text-yellow-200",
      Completed: "bg-green-500/20 text-green-200",
      Cancelled: "bg-red-500/20 text-red-200",
    }
    return statusMap[status] || "bg-gray-500/20 text-gray-200"
  }

  // Function to get badge color based on priority
  const getPriorityBadgeColor = (priority: string) => {
    const priorityMap: Record<string, string> = {
      Low: "bg-green-500/20 text-green-200",
      Medium: "bg-blue-500/20 text-blue-200",
      High: "bg-orange-500/20 text-orange-200",
      Urgent: "bg-red-500/20 text-red-200",
    }
    return priorityMap[priority] || "bg-blue-500/20 text-blue-200"
  }

  return (
    <>
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white text-lg">Projects</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
            onClick={() => setShowAddProjectModal(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/70">No projects found</p>
              <p className="text-white/50 text-sm mt-1">Add a project to get started</p>
            </div>
          ) : (
            <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredProjects.map((project) => (
                <li
                  key={project.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedProjectId === project.id
                      ? "bg-blue-600/30 border border-blue-400/30"
                      : "hover:bg-white/5 border border-white/10"
                  }`}
                  onClick={() => onSelectProject(project.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 rounded-full p-2">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{project.name}</p>
                        <p className="text-sm text-white/70 line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className={getStatusBadgeColor(project.status)}>{project.status}</Badge>
                    <Badge className={getPriorityBadgeColor(project.priority)}>{project.priority}</Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-1 text-xs text-white/60">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                      <span className="text-xs text-white/60">{project.progress}% complete</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Add Project Modal */}
      <Dialog open={showAddProjectModal} onOpenChange={setShowAddProjectModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>Enter the project details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select
                  value={newProject.priority}
                  onValueChange={(value) => setNewProject({ ...newProject, priority: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
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
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  className="col-span-3"
                  placeholder="$50,000"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="client" className="text-right">
                  Client
                </Label>
                <Select
                  value={newProject.clientId}
                  onValueChange={(value) => setNewProject({ ...newProject, clientId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select
                  value={newProject.departmentId}
                  onValueChange={(value) => setNewProject({ ...newProject, departmentId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

