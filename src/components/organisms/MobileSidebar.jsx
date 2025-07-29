import React from "react"
import { NavLink } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import CategoryItem from "@/components/molecules/CategoryItem"
import { cn } from "@/utils/cn"
import { motion, AnimatePresence } from "framer-motion"

const MobileSidebar = ({ isOpen, onClose, categories = [], taskCounts = {} }) => {
  const navigationItems = [
    { path: "/", label: "All Tasks", icon: "List", count: taskCounts.total || 0 },
    { path: "/today", label: "Today", icon: "Calendar", count: taskCounts.today || 0 },
    { path: "/upcoming", label: "Upcoming", icon: "Clock", count: taskCounts.upcoming || 0 },
    { path: "/completed", label: "Completed", icon: "CheckCircle", count: taskCounts.completed || 0 }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden flex flex-col shadow-xl"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="CheckSquare" size={20} className="text-white" />
                  </div>
                  <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="p-6">
                <nav className="space-y-2 mb-8">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
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

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div key={category.id} onClick={onClose}>
                        <CategoryItem category={category} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar