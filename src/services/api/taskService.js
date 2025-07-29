import tasksData from "@/services/mockData/tasks.json"

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(t => t.id === parseInt(id))
    if (!task) {
      throw new Error(`Task with id ${id} not found`)
    }
    return { ...task }
  }

  async create(taskData) {
    await delay(400)
    
    const newTask = {
      id: Math.max(...this.tasks.map(t => t.id), 0) + 1,
      title: taskData.title,
      description: taskData.description || "",
      categoryId: taskData.categoryId || "personal",
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, updateData) {
    await delay(300)
    
    const index = this.tasks.findIndex(t => t.id === parseInt(id))
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`)
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    this.tasks[index] = updatedTask
    return { ...updatedTask }
  }

  async delete(id) {
    await delay(250)
    
    const index = this.tasks.findIndex(t => t.id === parseInt(id))
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`)
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0]
    return { ...deletedTask }
  }

  async getByCategory(categoryId) {
    await delay(300)
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }))
  }

  async getCompleted() {
    await delay(300)
    return this.tasks.filter(t => t.completed).map(t => ({ ...t }))
  }

  async getIncomplete() {
    await delay(300)
    return this.tasks.filter(t => !t.completed).map(t => ({ ...t }))
  }
}

export const taskService = new TaskService()