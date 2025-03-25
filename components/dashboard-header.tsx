interface DashboardHeaderProps {
    title: string
    description: string
  }
  
  export function DashboardHeader({ title, description }: DashboardHeaderProps) {
    return (
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    )
  }
  
  