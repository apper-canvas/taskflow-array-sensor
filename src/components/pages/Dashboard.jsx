import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import TaskList from "@/components/organisms/TaskList"
import TaskQuickAdd from "@/components/molecules/TaskQuickAdd"
import FilterBar from "@/components/molecules/FilterBar"
import TaskModal from "@/components/organisms/TaskModal"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const Dashboard = () => {
  const { searchQuery, onTaskChange, categories } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  
  // Filter states
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getAll()
      setTasks(data.filter(task => !task.completed))
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      await taskService.update(taskId, { 
        completed: true,
        completedAt: new Date().toISOString()
      })
      setTasks(prev => prev.filter(t => t.id !== taskId))
      onTaskChange()
      toast.success(`"${task.title}" completed! 🎉`)
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDelete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      onTaskChange()
      toast.success(`"${task.title}" deleted`)
    } catch (err) {
      toast.error("Failed to delete task")
    }
  }

  const handleQuickAdd = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      onTaskChange()
    } catch (err) {
      toast.error("Failed to create task")
    }
  }

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.id, taskData)
        setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t))
      } else {
        const newTask = await taskService.create(taskData)
        setTasks(prev => [newTask, ...prev])
      }
      onTaskChange()
      setEditingTask(null)
      setIsTaskModalOpen(false)
    } catch (err) {
      toast.error("Failed to save task")
    }
  }

  const handleCloseModal = () => {
    setEditingTask(null)
    setIsTaskModalOpen(false)
  }

  const handleClearFilters = () => {
    setPriorityFilter("all")
    setSortBy("created")
  }

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!task.title.toLowerCase().includes(query) && 
            !task.description.toLowerCase().includes(query)) {
          return false
        }
      }
      
      // Priority filter
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false
      }
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "title":
          return a.title.localeCompare(b.title)
        default: // created
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Quick Add */}
        <TaskQuickAdd onAdd={handleQuickAdd} />

        {/* Filter Bar */}
        <FilterBar
          currentPriority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          currentSort={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No tasks found"
          emptyDescription="Create your first task to get started organizing your work!"
        />
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSave={handleTaskSave}
        categories={categories}
      />
    </div>
  )
}

export default Dashboard