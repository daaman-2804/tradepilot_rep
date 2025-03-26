import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Pencil1Icon } from "@radix-ui/react-icons"

interface SalaryTableProps {
  readOnly?: boolean
}

export function SalaryTable({ readOnly = false }: SalaryTableProps) {
  const employees = [
    {
      id: 1,
      name: "Harry Bender",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Head of Design",
      hours: 264,
      salary: "$2,647",
      progress: 70,
    },
    {
      id: 2,
      name: "Katy Fuller",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Fullstack Engineer",
      hours: 240,
      salary: "$2,400",
      progress: 60,
    },
    {
      id: 3,
      name: "Jonathan Kelly",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Mobile Lead",
      hours: 280,
      salary: "$3,100",
      progress: 85,
    },
    {
      id: 4,
      name: "Sarah Page",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Network Engineer",
      hours: 220,
      salary: "$2,200",
      progress: 55,
    },
    {
      id: 5,
      name: "Erica Wyatt",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Head of Design",
      hours: 260,
      salary: "$2,800",
      progress: 65,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Salary</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search employees..." className="w-[250px] pl-8" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {employees.map((employee) => (
            <div key={employee.id} className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.title}</div>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill-yellow" style={{ width: `${employee.progress}%` }}></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium mt-1">
                  {employee.hours} hrs / {employee.salary}
                </div>
                {!readOnly && (
                  <Button variant="ghost" size="icon">
                    <Pencil1Icon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

