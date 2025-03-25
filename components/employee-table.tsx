"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"

export function EmployeeTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const employees = [
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

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employees</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="w-[250px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input type="checkbox" className="h-4 w-4" />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Job Title <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead></TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Department <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Location <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Salary <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Start Date <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <input type="checkbox" className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{employee.name}</div>
                  </div>
                </TableCell>
                <TableCell>{employee.title}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell>{employee.salary}</TableCell>
                <TableCell>{employee.startDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === "Hired" || employee.status === "Invited"
                        ? "outline"
                        : employee.status === "Absent"
                          ? "secondary"
                          : "default"
                    }
                    className={
                      employee.status === "Invited"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : ""
                    }
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

