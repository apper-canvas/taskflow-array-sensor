import React, { useState } from "react"
import { format } from "date-fns"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"

const TaskModal = ({ isOpen, onClose, task = null, onSave, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    categoryId: task?.categoryId || "personal",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : ""
  })
  
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    }
    
    onSave(taskData)
    toast.success(task ? "Task updated successfully!" : "Task created successfully!")
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl shadow-modal max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {task ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <FormField
                label="Task Title"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                error={errors.title}
              />

              <FormField
                label="Description"
                type="textarea"
                placeholder="Add more details... (optional)"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Category"
                  type="select"
                  value={formData.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Priority"
                  type="select"
                  value={formData.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </FormField>
              </div>

              <FormField
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <ApperIcon name={task ? "Save" : "Plus"} size={18} className="mr-2" />
                  {task ? "Save Changes" : "Create Task"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default TaskModal