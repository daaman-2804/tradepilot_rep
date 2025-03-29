"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Box, LayoutDashboard, Users, Briefcase, DollarSign, FolderKanban, FileText, Building } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  // Remove the admin/owner logic completely
  const baseUrl = "/admin"

  // Fixed navigation items with Projects included
  const navItems = [
    { href: `${baseUrl}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
    { href: `${baseUrl}/employees`, label: "People", icon: Users },
    { href: `${baseUrl}/departments`, label: "Departments", icon: Briefcase },
    { href: `${baseUrl}/salary`, label: "Salary", icon: DollarSign },
    { href: `${baseUrl}/invoices`, label: "Invoices", icon: FileText },
    { href: `${baseUrl}/clients`, label: "Clients", icon: Building },
  ]

  return (
    <div className="flex items-center bg-blue-600 p-3 w-full">
      <Link href={`${baseUrl}/dashboard`} className="flex items-center space-x-2 mr-6">
        <div className="bg-white/20 p-2 rounded-lg">
          <Box className="h-6 w-6 text-white" />
        </div>
        <span className="font-bold text-xl text-white">TradePilot</span>
      </Link>
      <nav className="flex items-center space-x-4 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

