import React, { useState } from "react"
import { format, isToday, isTomorrow, isPast } from "date-fns"
import Checkbox from "@/components/atoms/Checkbox"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { motion } from "framer-motion"

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    
    // Add a small delay for animation
    setTimeout(() => {
      onToggleComplete(task.id)
      setIsCompleting(false)
    }, 300)
  }

  const formatDueDate = (date) => {
    if (!date) return null
    
    const dueDate = new Date(date)
    if (isToday(dueDate)) return "Today"
    if (isTomorrow(dueDate)) return "Tomorrow"
    return format(dueDate, "MMM dd")
  }

  const getDueDateColor = (date) => {
    if (!date) return "text-gray-500"
    
    const dueDate = new Date(date)
    if (isPast(dueDate) && !isToday(dueDate)) return "text-red-600"
    if (isToday(dueDate)) return "text-orange-600"
    return "text-gray-600"
  }

  const dueDateText = formatDueDate(task.dueDate)

  return (
    <motion.div
      layout
      className={cn(
        "group bg-white rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200 border border-gray-100",
        task.completed && "opacity-75 bg-gray-50",
        isCompleting && "scale-[0.98] opacity-50"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            className={cn(
              task.completed && "bg-success border-success"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-base font-medium text-gray-900 mb-1",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-sm text-gray-600 mb-3",
                  task.completed && "line-through text-gray-400"
                )}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 text-xs">
                <Badge variant={task.priority}>
                  {task.priority}
                </Badge>
                
                {dueDateText && (
                  <div className={cn(
                    "flex items-center gap-1",
                    getDueDateColor(task.dueDate)
                  )}>
                    <ApperIcon name="Calendar" size={12} />
                    <span>{dueDateText}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 w-8 rounded-full p-0 hover:bg-primary-50 hover:text-primary"
              >
                <ApperIcon name="Edit2" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 rounded-full p-0 hover:bg-red-50 hover:text-red-600"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem