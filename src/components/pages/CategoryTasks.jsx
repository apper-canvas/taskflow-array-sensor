import React, { useState, useEffect } from "react"
import { useParams, useOutletContext } from "react-router-dom"
import TaskList from "@/components/organisms/TaskList"
import TaskQuickAdd from "@/components/molecules/TaskQuickAdd"
import TaskModal from "@/components/organisms/TaskModal"
import { taskService } from "@/services/api/taskService"
import { categoryService } from "@/services/api/categoryService"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"

const CategoryTasks = () => {
  const { categoryId } = useParams()
  const { searchQuery, onTaskChange, categories } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  useEffect(() => {
    loadCategoryTasks()
    loadCategory()
  }, [categoryId])

  const loadCategory = async () => {
    try {
      const categoryData = await categoryService.getById(categoryId)
      setCategory(categoryData)
    } catch (err) {
      console.error("Failed to load category:", err)
    }
  }

  const loadCategoryTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const allTasks = await taskService.getAll()
      const categoryTasks = allTasks.filter(task => 
        task.categoryId === categoryId && !task.completed
      )
      setTasks(categoryTasks)
    } catch (err) {
      setError("Failed to load category tasks. Please try again.")
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
      const newTask = await taskService.create({
        ...taskData,
        categoryId: categoryId
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
        
        // Check if task still belongs to this category after update
        if (updatedTask.categoryId === categoryId) {
          setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t))
        } else {
          setTasks(prev => prev.filter(t => t.id !== editingTask.id))
        }
      } else {
        const newTask = await taskService.create(taskData)
        if (newTask.categoryId === categoryId) {
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
        {/* Category Header */}
        {category && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <ApperIcon name={category.icon} size={24} className="text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
            </div>
            <p className="text-gray-600">
              {tasks.length} active task{tasks.length !== 1 ? "s" : ""} in this category
            </p>
          </div>
        )}

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
          emptyMessage={`No tasks in ${category?.name || "this category"}`}
          emptyDescription="Add your first task to this category to get organized!"
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

export default CategoryTasks