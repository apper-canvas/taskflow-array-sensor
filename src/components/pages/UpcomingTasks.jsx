import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { isAfter, startOfDay } from "date-fns"
import TaskList from "@/components/organisms/TaskList"
import TaskQuickAdd from "@/components/molecules/TaskQuickAdd"
import TaskModal from "@/components/organisms/TaskModal"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const UpcomingTasks = () => {
  const { searchQuery, onTaskChange, categories } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  useEffect(() => {
    loadUpcomingTasks()
  }, [])

  const loadUpcomingTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const allTasks = await taskService.getAll()
      const tomorrow = startOfDay(new Date())
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const upcomingTasks = allTasks.filter(task => {
        if (task.completed || !task.dueDate) return false
        const dueDate = new Date(task.dueDate)
        return isAfter(dueDate, tomorrow) || dueDate.getTime() === tomorrow.getTime()
      })
      setTasks(upcomingTasks)
    } catch (err) {
      setError("Failed to load upcoming tasks. Please try again.")
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
      toast.success(`"${task.title}" completed ahead of schedule! 🌟`)
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
      // Set due date to tomorrow for tasks added from Upcoming view
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const newTask = await taskService.create({
        ...taskData,
        dueDate: tomorrow.toISOString()
      })
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
        
        // Check if task still belongs to upcoming after update
        const tomorrow = startOfDay(new Date())
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        if (updatedTask.dueDate && 
            (isAfter(new Date(updatedTask.dueDate), tomorrow) || 
             new Date(updatedTask.dueDate).getTime() === tomorrow.getTime())) {
          setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t))
        } else {
          setTasks(prev => prev.filter(t => t.id !== editingTask.id))
        }
      } else {
        const newTask = await taskService.create(taskData)
        const tomorrow = startOfDay(new Date())
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        if (newTask.dueDate && 
            (isAfter(new Date(newTask.dueDate), tomorrow) || 
             new Date(newTask.dueDate).getTime() === tomorrow.getTime())) {
          setTasks(prev => [newTask, ...prev])
        }
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

  // Filter tasks by search query
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return task.title.toLowerCase().includes(query) || 
           task.description.toLowerCase().includes(query)
  })

  // Sort by due date (earliest first) then by priority
  const sortedTasks = filteredTasks.sort((a, b) => {
    const dateA = new Date(a.dueDate)
    const dateB = new Date(b.dueDate)
    const dateDiff = dateA - dateB
    if (dateDiff !== 0) return dateDiff
    
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Tasks</h2>
          <p className="text-gray-600">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} scheduled for the future
          </p>
        </div>

        {/* Quick Add */}
        <TaskQuickAdd onAdd={handleQuickAdd} />

        {/* Task List */}
        <TaskList
          tasks={sortedTasks}
          loading={loading}
          error={error}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No upcoming tasks scheduled"
          emptyDescription="Plan ahead by creating tasks with future due dates to stay organized!"
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

export default UpcomingTasks