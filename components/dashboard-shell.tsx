"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"

interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className = "" }: DashboardShellProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen ${className}`}>
      <div className="bg-blue-600 w-full">
        <div className="container mx-auto">
          <MainNav />
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex h-16 items-center px-4">
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
    </div>
  )
}

