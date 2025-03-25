import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon } from "lucide-react"

export function EmployeeDetails() {
  return (
    <Card>
      <CardHeader className="relative pb-0">
        <div className="absolute inset-0 h-32 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-lg"></div>
        <div className="relative flex flex-col items-center pt-16">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Amélie Laurent" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-xl">Amélie Laurent</CardTitle>
          <p className="text-sm text-muted-foreground">UX Designer</p>
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
                  <span className="text-sm text-muted-foreground">Birthday</span>
                  <span className="text-sm">26 September 1998</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Phone number</span>
                  <span className="text-sm">+33 1 70 36 39 50</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">E-Mail</span>
                  <span className="text-sm">amelielaurent88@gmail.com</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Citizenship</span>
                  <span className="text-sm">France</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">City</span>
                  <span className="text-sm">Paris</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <div className="flex justify-between w-full">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="text-sm">95700 Roissy-en-France</span>
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

