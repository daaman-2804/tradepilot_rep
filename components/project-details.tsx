"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Calendar,
  DollarSign,
  Edit,
  Building,
  Users,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
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

type ProjectStatus = "Not Started" | "In Progress" | "On Hold" | "Completed" | "Cancelled"
type ProjectPriority = "Low" | "Medium" | "High" | "Urgent"

type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
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

type ProjectDetailsProps = {
  projectId: string | null
}

type PartialProject = Partial<Omit<Project, 'status' | 'priority'>> & {
  status?: ProjectStatus
  priority?: ProjectPriority
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [clients, setClients] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  const [showEditProjectModal, setShowEditProjectModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false)
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false)

  const [editProject, setEditProject] = useState<PartialProject>({})
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
    assigneeId: "",
    dueDate: "",
    priority: "Medium",
  })
  const [newTeamMember, setNewTeamMember] = useState({
    employeeId: "",
    role: "",
  })

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return

      const projectDoc = doc(db, "projects", projectId)
      const projectSnapshot = await getDoc(projectDoc)

      if (projectSnapshot.exists()) {
        setProject({ id: projectSnapshot.id, ...projectSnapshot.data() } as Project)
      } else {
        console.error("No such document!")
      }
    }

    loadProject()
  }, [projectId])

  useEffect(() => {
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

      // Ensure employees are loaded properly
      const savedEmployees = localStorage.getItem("employees")
      if (savedEmployees) {
        const parsedEmployees = JSON.parse(savedEmployees)
        console.log("Loaded employees:", parsedEmployees)
        setEmployees(parsedEmployees)
      } else {
        // If no employees in localStorage, create default ones
        const defaultEmployees = [
          {
            id: 1,
            name: "Anatoly Belik",
            avatar: "/placeholder.svg?height=40&width=40",
            title: "Head of Design",
            department: "Product",
            location: "Stockholm",
            salary: "$1,350",
            startDate: "Mar 13, 2023",
            status: "Hired",
          },
          {
            id: 2,
            name: "Ksenia Bator",
            avatar: "/placeholder.svg?height=40&width=40",
            title: "Fullstack Engineer",
            department: "Engineering",
            location: "Miami",
            salary: "$1,500",
            startDate: "Oct 13, 2023",
            status: "Absent",
          },
          {
            id: 3,
            name: "Bogdan Nikitin",
            avatar: "/placeholder.svg?height=40&width=40",
            title: "Mobile Lead",
            department: "Product",
            location: "Kyiv",
            salary: "$2,600",
            startDate: "Nov 4, 2023",
            status: "Invited",
          },
          {
            id: 4,
            name: "Arsen Yatsenko",
            avatar: "/placeholder.svg?height=40&width=40",
            title: "Sales Manager",
            department: "Operations",
            location: "Ottawa",
            salary: "$900",
            startDate: "Sep 4, 2021",
            status: "Employed",
          },
          {
            id: 5,
            name: "Daria Yurchenko",
            avatar: "/placeholder.svg?height=40&width=40",
            title: "Network Engineer",
            department: "Product",
            location: "Sao Paulo",
            salary: "$1,000",
            startDate: "Feb 21, 2023",
            status: "Invited",
          },
          {
            id: 6,
            name: "Yulia Polishchuk",
            avatar: "/placeholder.svg?height=40&width=40",
            title: "Head of Design",
            department: "Product",
            location: "London",
            salary: "$1,700",
            startDate: "Aug 2, 2024",
            status: "Absent",
          },
        ]
        localStorage.setItem("employees", JSON.stringify(defaultEmployees))
        console.log("Created default employees:", defaultEmployees)
        setEmployees(defaultEmployees)
      }
    }

    loadRelatedData()
  }, [projectId])

  const handleEditProject = () => {
    if (!project) return

    // Find client and department names
    const client = clients.find((c) => c.id === editProject.clientId)
    const department = departments.find((d) => d.id === editProject.departmentId)

    // Create updated project object
    const updatedProject = {
      ...project,
      ...editProject,
      clientName: client ? client.name : project.clientName,
      departmentName: department ? department.name : project.departmentName,
      budget: editProject.budget?.startsWith("$") ? editProject.budget : `$${editProject.budget}`,
    }

    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updatedProjects = projects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Update local state
    setProject(updatedProject)

    // Notify components of the update
    window.dispatchEvent(new Event("projectsUpdated"))

    // Close the modal
    setShowEditProjectModal(false)
  }

  const handleDeleteProject = () => {
    if (!project) return

    // Remove project from localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updatedProjects = projects.filter((p: Project) => p.id !== project.id)
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Notify components of the update
    window.dispatchEvent(new Event("projectsUpdated"))

    // Close the dialog
    setShowDeleteProjectDialog(false)
  }

  const handleAddTask = () => {
    if (!project) return

    // Find assignee name
    const assignee = employees.find((e) => e.id.toString() === newTask.assigneeId)

    // Create new task
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as any,
      assigneeId: newTask.assigneeId,
      assigneeName: assignee ? assignee.name : undefined,
      dueDate: newTask.dueDate,
      priority: newTask.priority as any,
    }

    // Add task to project
    const updatedProject = {
      ...project,
      tasks: [...project.tasks, task],
    }

    // Update progress based on completed tasks
    const completedTasks = updatedProject.tasks.filter((t) => t.status === "Completed").length
    const totalTasks = updatedProject.tasks.length
    updatedProject.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updatedProjects = projects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Update local state
    setProject(updatedProject)

    // Notify components of the update
    window.dispatchEvent(new Event("projectsUpdated"))

    // Close the modal and reset form
    setShowAddTaskModal(false)
    setNewTask({
      title: "",
      description: "",
      status: "To Do",
      assigneeId: "",
      dueDate: "",
      priority: "Medium",
    })
  }

  const handleAddTeamMember = () => {
    if (!project) return

    // Find employee
    const employee = employees.find((e) => e.id.toString() === newTeamMember.employeeId)
    if (!employee) {
      console.error("Employee not found:", newTeamMember.employeeId)
      return
    }

    // Check if employee is already a team member
    const isAlreadyMember = project.teamMembers.some((m) => m.id === newTeamMember.employeeId)
    if (isAlreadyMember) {
      // Could show an error message here
      console.warn("Employee is already a team member")
      return
    }

    // Create new team member
    const teamMember: TeamMember = {
      id: newTeamMember.employeeId,
      name: employee.name,
      role: newTeamMember.role || employee.title || "Team Member",
      avatar: employee.avatar || "/placeholder.svg?height=40&width=40",
    }

    // Add team member to project
    const updatedProject = {
      ...project,
      teamMembers: [...project.teamMembers, teamMember],
    }

    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updatedProjects = projects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Update local state
    setProject(updatedProject)

    // Notify components of the update
    window.dispatchEvent(new Event("projectsUpdated"))

    // Close the modal and reset form
    setShowAddTeamMemberModal(false)
    setNewTeamMember({
      employeeId: "",
      role: "",
    })
  }

  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    if (!project) return

    // Update task status
    const updatedTasks = project.tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus as any } : task,
    )

    // Update progress based on completed tasks
    const completedTasks = updatedTasks.filter((t) => t.status === "Completed").length
    const totalTasks = updatedTasks.length
    const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Update project
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
      progress: newProgress,
    }

    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updatedProjects = projects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Update local state
    setProject(updatedProject)

    // Notify components of the update
    window.dispatchEvent(new Event("projectsUpdated"))
  }

  const handleRemoveTeamMember = (memberId: string) => {
    if (!project) return

    // Remove team member
    const updatedTeamMembers = project.teamMembers.filter((member) => member.id !== memberId)

    // Update project
    const updatedProject = {
      ...project,
      teamMembers: updatedTeamMembers,
    }

    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("projects") || "[]")
    const updatedProjects = projects.map((p: Project) => (p.id === project.id ? updatedProject : p))
    localStorage.setItem("projects", JSON.stringify(updatedProjects))

    // Update local state
    setProject(updatedProject)

    // Notify components of the update
    window.dispatchEvent(new Event("projectsUpdated"))
  }

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

  // Function to get task status icon
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />
      case "In Progress":
        return <Circle className="h-4 w-4 text-blue-400" />
      case "In Review":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <Square className="h-4 w-4 text-gray-400" />
    }
  }

  if (!project) {
    return (
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-white/70">Select a project to view details</p>
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
              {project.name}
              <Badge className={getStatusBadgeColor(project.status)}>{project.status}</Badge>
              <Badge className={getPriorityBadgeColor(project.priority)}>{project.priority}</Badge>
            </CardTitle>
            <p className="text-white/70 mt-1">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
              onClick={() => setShowEditProjectModal(true)}
            >
              <Edit className="h-4 w-4" /> Edit Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-400/30 bg-white/10 text-red-300 hover:bg-red-900/20 hover:text-red-200 flex items-center gap-2"
              onClick={() => setShowDeleteProjectDialog(true)}
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
              <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600">
                Tasks
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-blue-600">
                Team
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600">
                Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Timeline</p>
                      <p className="text-white">
                        {new Date(project.startDate).toLocaleDateString()} -{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Budget</p>
                      <p className="text-white">{project.budget}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Client</p>
                      <p className="text-white">{project.clientName || "Not assigned"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Department</p>
                      <p className="text-white">{project.departmentName || "Not assigned"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-full p-2">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Team Members</p>
                      <p className="text-white">{project.teamMembers.length}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-3">Project Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white/80">Overall Progress</span>
                        <span className="text-sm font-medium text-white">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/70">Tasks</p>
                        <p className="text-xl font-semibold text-white">{project.tasks.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Completed</p>
                        <p className="text-xl font-semibold text-white">
                          {project.tasks.filter((t) => t.status === "Completed").length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-3">Task Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Square className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-white/80">To Do</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {project.tasks.filter((t) => t.status === "To Do").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Circle className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-white/80">In Progress</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {project.tasks.filter((t) => t.status === "In Progress").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-white/80">In Review</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {project.tasks.filter((t) => t.status === "In Review").length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-white/80">Completed</span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {project.tasks.filter((t) => t.status === "Completed").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Project Tasks</h3>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  onClick={() => setShowAddTaskModal(true)}
                >
                  <Plus className="h-4 w-4" /> Add Task
                </Button>
              </div>

              {project.tasks.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                  <CheckSquare className="h-12 w-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/70">No tasks in this project</p>
                  <p className="text-white/50 text-sm mt-1">Add tasks to track progress</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {project.tasks.map((task) => (
                    <div key={task.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getTaskStatusIcon(task.status)}
                          <div>
                            <p className="font-medium text-white">{task.title}</p>
                            <p className="text-sm text-white/70">{task.description}</p>
                          </div>
                        </div>
                        <Badge className={getPriorityBadgeColor(task.priority)}>{task.priority}</Badge>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {task.assigneeName && (
                            <div className="flex items-center gap-1 text-sm text-white/70">
                              <span>Assigned to:</span>
                              <span className="text-white">{task.assigneeName}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-sm text-white/70">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Select value={task.status as ProjectStatus} onValueChange={(value) => handleUpdateTaskStatus(task.id, value)}>
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="team">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Project Team</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
                  onClick={() => setShowAddTeamMemberModal(true)}
                >
                  <Plus className="h-4 w-4" /> Add Team Member
                </Button>
              </div>

              {project.teamMembers.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                  <Users className="h-12 w-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/70">No team members assigned</p>
                  <p className="text-white/50 text-sm mt-1">Add team members to this project</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{member.name}</p>
                          <p className="text-sm text-white/70">{member.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/50 hover:text-red-300 hover:bg-transparent"
                        onClick={() => handleRemoveTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-white font-medium mb-4">Project Timeline</h3>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/20"></div>

                  <div className="space-y-6 ml-10">
                    {/* Project start */}
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="text-white font-medium">Project Start</p>
                        <p className="text-sm text-white/70">{new Date(project.startDate).toLocaleDateString()}</p>
                        <p className="text-sm text-white/50 mt-1">Project {project.name} initiated</p>
                      </div>
                    </div>

                    {/* Tasks in chronological order */}
                    {project.tasks
                      .filter((task) => task.dueDate)
                      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                      .map((task) => (
                        <div key={task.id} className="relative">
                          <div
                            className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full ${
                              task.status === "Completed"
                                ? "bg-green-500"
                                : task.status === "In Progress"
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-white font-medium">{task.title}</p>
                            <p className="text-sm text-white/70">Due: {new Date(task.dueDate!).toLocaleDateString()}</p>
                            <p className="text-sm text-white/50 mt-1">{task.description}</p>
                            <Badge className={`mt-2 ${getStatusBadgeColor(task.status)}`}>{task.status}</Badge>
                          </div>
                        </div>
                      ))}

                    {/* Project end */}
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full bg-green-500"></div>
                      <div>
                        <p className="text-white font-medium">Project End</p>
                        <p className="text-sm text-white/70">{new Date(project.endDate).toLocaleDateString()}</p>
                        <p className="text-sm text-white/50 mt-1">Expected completion date</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Project Modal */}
      <Dialog open={showEditProjectModal} onOpenChange={setShowEditProjectModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={editProject.name || ""}
                onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={editProject.description || ""}
                onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={editProject.status as ProjectStatus}
                onValueChange={(value) => setEditProject({ ...editProject, status: value as ProjectStatus })}
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
              <Label htmlFor="edit-priority" className="text-right">
                Priority
              </Label>
              <Select
                value={editProject.priority as ProjectPriority}
                onValueChange={(value) => setEditProject({ ...editProject, priority: value as ProjectPriority })}
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
              <Label htmlFor="edit-startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="edit-startDate"
                type="date"
                value={editProject.startDate || ""}
                onChange={(e) => setEditProject({ ...editProject, startDate: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="edit-endDate"
                type="date"
                value={editProject.endDate || ""}
                onChange={(e) => setEditProject({ ...editProject, endDate: e.target.value })}
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
                value={editProject.budget || ""}
                onChange={(e) => setEditProject({ ...editProject, budget: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-client" className="text-right">
                Client
              </Label>
              <Select
                value={editProject.clientId}
                onValueChange={(value) => setEditProject({ ...editProject, clientId: value })}
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
              <Label htmlFor="edit-department" className="text-right">
                Department
              </Label>
              <Select
                value={editProject.departmentId}
                onValueChange={(value) => setEditProject({ ...editProject, departmentId: value })}
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
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Modal */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>Enter the task details. Click add when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Title
              </Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-status" className="text-right">
                Status
              </Label>
              <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-priority" className="text-right">
                Priority
              </Label>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
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
              <Label htmlFor="task-assignee" className="text-right">
                Assignee
              </Label>
              <Select
                value={newTask.assigneeId}
                onValueChange={(value) => setNewTask({ ...newTask, assigneeId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="task-dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Modal */}
      <Dialog open={showAddTeamMemberModal} onOpenChange={setShowAddTeamMemberModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Select an employee to add to the project team.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team-employee" className="text-right">
                Employee
              </Label>
              <Select
                value={newTeamMember.employeeId}
                onValueChange={(value) => setNewTeamMember({ ...newTeamMember, employeeId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name} ({employee.title})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-employees" disabled>
                      No employees available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team-role" className="text-right">
                Project Role
              </Label>
              <Input
                id="team-role"
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                className="col-span-3"
                placeholder="e.g. Developer, Designer, Project Manager"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddTeamMember}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newTeamMember.employeeId || !newTeamMember.role}
            >
              Add Team Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Confirmation */}
      <AlertDialog open={showDeleteProjectDialog} onOpenChange={setShowDeleteProjectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project and all associated tasks. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

