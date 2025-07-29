import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const CategoryItem = ({ category, isActive = false }) => {
  return (
    <NavLink
      to={`/category/${category.id}`}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group hover:bg-primary-50",
        isActive 
          ? "bg-primary text-white shadow-md" 
          : "text-gray-700 hover:text-primary"
      )}
    >
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: category.color }}
      />
      <ApperIcon 
        name={category.icon} 
        size={18} 
        className={cn(
          "flex-shrink-0 transition-colors duration-200",
          isActive ? "text-white" : "text-gray-500 group-hover:text-primary"
        )}
      />
      <span className="flex-1 text-sm font-medium truncate">
        {category.name}
      </span>
      <span className={cn(
        "text-xs px-2 py-1 rounded-full transition-colors duration-200",
        isActive 
          ? "bg-white/20 text-white" 
          : "bg-gray-100 text-gray-600 group-hover:bg-primary-100 group-hover:text-primary-700"
      )}>
        {category.taskCount}
      </span>
    </NavLink>
  )
}

export default CategoryItem