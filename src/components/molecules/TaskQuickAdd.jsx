import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const TaskQuickAdd = ({ onAdd, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Please enter a task title")
      return
    }
    
    onAdd({
      title: title.trim(),
      description: "",
      categoryId: "personal",
      priority: "medium",
      dueDate: null
    })
    
    setTitle("")
    setIsExpanded(false)
    toast.success("Task added successfully!")
  }

  const handleCancel = () => {
    setTitle("")
    setIsExpanded(false)
  }

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className={`w-full justify-start text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-800 border-2 border-dashed border-gray-300 hover:border-primary ${className}`}
        variant="ghost"
      >
        <ApperIcon name="Plus" size={18} className="mr-2" />
        Add a task...
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 p-4 bg-white rounded-lg border-2 border-primary shadow-sm ${className}`}>
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="border-0 focus:ring-0 p-0 text-base placeholder:text-gray-400"
      />
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm">
          <ApperIcon name="Plus" size={16} className="mr-1" />
          Add Task
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default TaskQuickAdd