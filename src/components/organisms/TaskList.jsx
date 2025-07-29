import React from "react"
import TaskItem from "@/components/organisms/TaskItem"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { motion, AnimatePresence } from "framer-motion"

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  error = null, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  emptyMessage = "No tasks found",
  emptyDescription = "Create your first task to get started!"
}) => {
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} />
  }

  if (tasks.length === 0) {
    return <Empty message={emptyMessage} description={emptyDescription} />
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
          >
            <TaskItem
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList