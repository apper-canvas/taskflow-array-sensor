import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { isToday } from "date-fns"
import TaskList from "@/components/organisms/TaskList"
import TaskQuickAdd from "@/components/molecules/TaskQuickAdd"
import TaskModal from "@/components/organisms/TaskModal"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const TodayTasks = () => {
  const { searchQuery, onTaskChange, categories } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  useEffect(() => {
    loadTodayTasks()
  }, [])

  const loadTodayTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const allTasks = await taskService.getAll()
      const todayTasks = allTasks.filter(task => {
        if (task.completed || !task.dueDate) return false
        return isToday(new Date(task.dueDate))
      })
      setTasks(todayTasks)
    } catch (err) {
      setError("Failed to load today's tasks. Please try again.")
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
      toast.success(`"${task.title}" completed! Great job! 🎉`)
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
      // Set due date to today for tasks added from Today view
      const newTask = await taskService.create({
        ...taskData,
        dueDate: new Date().toISOString()
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
        
        // Check if task still belongs to today after update
        if (updatedTask.dueDate && isToday(new Date(updatedTask.dueDate))) {
          setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t))
        } else {
          setTasks(prev => prev.filter(t => t.id !== editingTask.id))
        }
      } else {
        const newTask = await taskService.create(taskData)
        if (newTask.dueDate && isToday(new Date(newTask.dueDate))) {
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

  // Sort by priority (high to low) then by creation time
  const sortedTasks = filteredTasks.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Focus</h2>
          <p className="text-gray-600">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} due today
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
          emptyMessage="No tasks for today! 🎉"
          emptyDescription="You're all caught up for today. Take a moment to plan ahead or enjoy some well-deserved rest!"
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

export default TodayTasks