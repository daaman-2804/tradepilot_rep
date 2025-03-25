"use client"

import { useState } from "react"
import { Box } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectList } from "@/components/project-list"
import { ProjectDetails } from "@/components/project-details"

export function ProjectsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1565C0] to-[#E3F2FD]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100/80">
            <Box className="h-6 w-6" />
            <span className="font-bold text-xl">TradePilot</span>
          </div>
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            <Link
              href="/admin/dashboard"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/employees"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              People
            </Link>
            <Link
              href="/admin/departments"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Departments
            </Link>
            <Link
              href="/admin/salary"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Salary
            </Link>
            <Link
              href="/admin/projects"
              className="text-sm font-medium transition-colors hover:text-gray-900 bg-gray-900 text-white px-3 py-1.5 rounded-full"
            >
              Projects
            </Link>
            <Link
              href="/admin/invoices"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Invoices
            </Link>
            <Link
              href="/admin/clients"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Clients
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
              </svg>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>TP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-5xl font-semibold text-white mb-6">Projects</h1>

        {/* Main Card Container */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 overflow-hidden p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-semibold text-white mb-4">Project List</h2>
              <ProjectList onSelectProject={setSelectedProjectId} selectedProjectId={selectedProjectId} />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-white mb-4">Project Details</h2>
              <ProjectDetails projectId={selectedProjectId} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

