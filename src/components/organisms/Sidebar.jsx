import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import CategoryItem from "@/components/molecules/CategoryItem"
import { cn } from "@/utils/cn"

const Sidebar = ({ categories = [], taskCounts = {} }) => {
  const navigationItems = [
    { path: "/", label: "All Tasks", icon: "List", count: taskCounts.total || 0 },
    { path: "/today", label: "Today", icon: "Calendar", count: taskCounts.today || 0 },
    { path: "/upcoming", label: "Upcoming", icon: "Clock", count: taskCounts.upcoming || 0 },
    { path: "/completed", label: "Completed", icon: "CheckCircle", count: taskCounts.completed || 0 }
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-md" 
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                size={18} 
                className="flex-shrink-0"
              />
              <span className="flex-1 text-sm font-medium">
                {item.label}
              </span>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full transition-colors duration-200",
                "bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-700"
              )}>
                {item.count}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <CategoryItem 
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar