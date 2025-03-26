"use client"

import { useEffect, useState } from "react"
import { db } from "@/src/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react"

type Employee = {
  id: string
  name: string
  avatar: string
  title: string
  department: string
  location: string
  salary: string
  startDate: string
  status: string
}

type EmployeeDetailsProps = {
  employeeId: string | null
}

export function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const loadEmployee = async () => {
      if (employeeId === null) return

      const employeeDoc = doc(db, "employees", employeeId)
      const employeeSnapshot = await getDoc(employeeDoc)

      if (employeeSnapshot.exists()) {
        const employeeData = employeeSnapshot.data() as Employee
        const { id, ...rest } = employeeData;
        setEmployee({ id: employeeSnapshot.id, ...rest });
      } else {
        console.error("No such document!")
      }
    }

    loadEmployee()
  }, [employeeId])

  if (!employee) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader className="relative pb-0">
        <div className="absolute inset-0 h-32 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-lg"></div>
        <div className="relative flex flex-col items-center pt-16">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-xl">{employee.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{employee.title}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="text-sm">{employee.department}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Phone number</span>
                  <span className="text-sm">{employee.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">E-Mail</span>
                  <span className="text-sm">{employee.salary}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Start Date</span>
                  <span className="text-sm">{employee.startDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm">{employee.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Documents</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <FileIcon className="h-5 w-5 text-blue-500" />
                <div className="text-xs">
                  <div>Contract</div>
                  <div className="text-muted-foreground">23 mb</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <FileIcon className="h-5 w-5 text-red-500" />
                <div className="text-xs">
                  <div>Resume</div>
                  <div className="text-muted-foreground">76 mb</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Statistics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Business trips</span>
                  <span className="text-sm font-medium">58 days</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill-yellow" style={{ width: "58%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Sickness</span>
                  <span className="text-sm font-medium">24 days</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill-gray" style={{ width: "24%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

