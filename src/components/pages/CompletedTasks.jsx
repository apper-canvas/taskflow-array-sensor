import React, { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { format } from "date-fns"
import TaskList from "@/components/organisms/TaskList"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const CompletedTasks = () => {
  const { searchQuery, onTaskChange } = useOutletContext()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCompletedTasks()
  }, [])

  const loadCompletedTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const allTasks = await taskService.getAll()
      const completedTasks = allTasks.filter(task => task.completed)
      setTasks(completedTasks)
    } catch (err) {
      setError("Failed to load completed tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      await taskService.update(taskId, { 
        completed: false,
        completedAt: null
      })
      setTasks(prev => prev.filter(t => t.id !== taskId))
      onTaskChange()
      toast.success(`"${task.title}" moved back to active tasks`)
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const handleDelete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(t => t.id !== taskId))
      onTaskChange()
      toast.success(`"${task.title}" permanently deleted`)
    } catch (err) {
      toast.error("Failed to delete task")
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all completed tasks? This action cannot be undone.")) {
      return
    }

    try {
      await Promise.all(tasks.map(task => taskService.delete(task.id)))
      setTasks([])
      onTaskChange()
      toast.success("All completed tasks have been cleared")
    } catch (err) {
      toast.error("Failed to clear completed tasks")
    }
  }

  // Filter tasks by search query
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return task.title.toLowerCase().includes(query) || 
           task.description.toLowerCase().includes(query)
  })

  // Sort by completion date (most recent first)
  const sortedTasks = filteredTasks.sort((a, b) => 
    new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt)
  )

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Completed Tasks</h2>
            <p className="text-gray-600">
              {tasks.length} completed task{tasks.length !== 1 ? "s" : ""} - Great work! 🎉
            </p>
          </div>
          
          {tasks.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} />
              Clear All
            </Button>
          )}
        </div>

        {/* Completed Tasks List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading completed tasks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadCompletedTasks}>
                <ApperIcon name="RefreshCw" size={16} className="mr-2" />
                Try Again
              </Button>
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Archive" size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No completed tasks yet
              </h3>
              <p className="text-gray-600">
                Complete some tasks to see them here. You've got this! 💪
              </p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg p-4 shadow-card border border-gray-100 opacity-90">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-success rounded border-2 border-success flex items-center justify-center">
                      <ApperIcon name="Check" size={12} className="text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-gray-500 line-through mb-1">
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className="text-sm text-gray-400 line-through mb-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            Completed {task.completedAt ? format(new Date(task.completedAt), "MMM dd, yyyy") : "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleComplete(task.id)}
                          className="h-8 w-8 rounded-full p-0 hover:bg-primary-50 hover:text-primary"
                          title="Mark as incomplete"
                        >
                          <ApperIcon name="RotateCcw" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
                          className="h-8 w-8 rounded-full p-0 hover:bg-red-50 hover:text-red-600"
                          title="Delete permanently"
                        >
                          <ApperIcon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CompletedTasks