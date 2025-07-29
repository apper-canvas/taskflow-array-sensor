import React, { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useLocation } from "react-router-dom"
import Header from "@/components/organisms/Header"
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"  
import TaskModal from "@/components/organisms/TaskModal"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"

const Layout = () => {
  const location = useLocation()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [taskCounts, setTaskCounts] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadCategories()
    loadTaskCounts()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const loadTaskCounts = async () => {
    try {
      const tasks = await taskService.getAll()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const counts = {
        total: tasks.filter(t => !t.completed).length,
        today: tasks.filter(t => {
          if (!t.dueDate || t.completed) return false
          const dueDate = new Date(t.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() === today.getTime()
        }).length,
        upcoming: tasks.filter(t => {
          if (!t.dueDate || t.completed) return false
          const dueDate = new Date(t.dueDate)
          dueDate.setHours(0, 0, 0, 0)
          return dueDate.getTime() > today.getTime()
        }).length,
        completed: tasks.filter(t => t.completed).length
      }

      setTaskCounts(counts)
    } catch (error) {
      console.error("Failed to load task counts:", error)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleQuickAdd = () => {
    setIsTaskModalOpen(true)
  }

  const handleTaskSave = async (taskData) => {
    try {
      await taskService.create(taskData)
      loadTaskCounts()
    } catch (error) {
      console.error("Failed to save task:", error)
    }
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "All Tasks"
      case "/today":
        return "Today"
      case "/upcoming":
        return "Upcoming"
      case "/completed":
        return "Completed"
      default:
        if (location.pathname.startsWith("/category/")) {
          const categoryId = location.pathname.split("/")[2]
          const category = categories.find(c => c.id === categoryId)
          return category ? category.name : "Category"
        }
        return "TaskFlow"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={14} className="text-white" />
              </div>
              <h1 className="text-lg font-bold font-display text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>
          <Button size="sm" onClick={handleQuickAdd}>
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>
      </div>

      <div className="flex h-screen lg:h-auto lg:min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            categories={categories} 
            taskCounts={taskCounts}
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          categories={categories}
          taskCounts={taskCounts}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <Header 
              onSearch={handleSearch}
              onQuickAdd={handleQuickAdd}
              title={getPageTitle()}
            />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <Outlet context={{ 
              searchQuery, 
              onTaskChange: loadTaskCounts,
              categories 
            }} />
          </main>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
        categories={categories}
      />
    </div>
  )
}

export default Layout