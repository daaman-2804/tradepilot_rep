import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EmployeeStats() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Employee Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Interviews</span>
              <span className="text-sm font-medium">25%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill-green" style={{ width: "25%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Hired</span>
              <span className="text-sm font-medium">51%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill-yellow" style={{ width: "51%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Project time</span>
              <span className="text-sm font-medium">10%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill-gray" style={{ width: "10%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm">Output</span>
              <span className="text-sm font-medium">14%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill-gray" style={{ width: "14%" }}></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

