import { toast } from 'react-toastify'

class TaskService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'task_c'
  }

  // Helper method to map database fields to UI fields
  mapFromDatabase(task) {
    if (!task) return null
    return {
      id: task.Id,
      title: task.title_c || task.Name || '',
      description: task.description_c || '',
      categoryId: task.category_id_c?.Id || task.category_id_c || 'personal',
      priority: task.priority_c || 'medium',
      dueDate: task.due_date_c || null,
      completed: task.completed_c || false,
      completedAt: task.completed_at_c || null,
      createdAt: task.CreatedOn || new Date().toISOString(),
      updatedAt: task.ModifiedOn || new Date().toISOString()
    }
  }

  // Helper method to map UI fields to database fields
  mapToDatabase(taskData) {
    const data = {}
    
    // Only include updateable fields
    if (taskData.title !== undefined) data.title_c = taskData.title
    if (taskData.description !== undefined) data.description_c = taskData.description
    if (taskData.priority !== undefined) data.priority_c = taskData.priority
    if (taskData.dueDate !== undefined) data.due_date_c = taskData.dueDate
    if (taskData.completed !== undefined) data.completed_c = taskData.completed
    if (taskData.completedAt !== undefined) data.completed_at_c = taskData.completedAt
    if (taskData.categoryId !== undefined) {
      // Handle lookup field - convert to integer if it's an object
      data.category_id_c = typeof taskData.categoryId === 'object' ? taskData.categoryId.Id : parseInt(taskData.categoryId)
    }
    
    return data
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching tasks:", response.message)
        toast.error(response.message)
        return []
      }

      if (!response.data || response.data.length === 0) {
        return []
      }

      return response.data.map(task => this.mapFromDatabase(task))
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response?.data) {
        throw new Error(`Task with id ${id} not found`)
      }

      return this.mapFromDatabase(response.data)
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [this.mapToDatabase(taskData)]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error creating task:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel || 'Error'}: ${error.message || error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data)
        }
      }
      
      throw new Error('Failed to create task')
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      throw error
    }
  }

  async update(id, updateData) {
    try {
      const dbData = this.mapToDatabase(updateData)
      const params = {
        records: [{
          Id: parseInt(id),
          ...dbData
        }]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error updating task:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel || 'Error'}: ${error.message || error}`))
            }
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return this.mapFromDatabase(successful[0].data)
        }
      }
      
      throw new Error('Failed to update task')
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      throw error
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error deleting task:", response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      throw error
    }
  }

  async getByCategory(categoryId) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching category tasks:", response.message)
        return []
      }

      if (!response.data || response.data.length === 0) {
        return []
      }

      return response.data.map(task => this.mapFromDatabase(task))
    } catch (error) {
      console.error("Error fetching category tasks:", error?.response?.data?.message || error)
      return []
    }
  }

  async getCompleted() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [true]}],
        orderBy: [{"fieldName": "completed_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching completed tasks:", response.message)
        return []
      }

      return response.data ? response.data.map(task => this.mapFromDatabase(task)) : []
    } catch (error) {
      console.error("Error fetching completed tasks:", error?.response?.data?.message || error)
      return []
    }
  }

  async getIncomplete() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "category_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching incomplete tasks:", response.message)
        return []
      }

      return response.data ? response.data.map(task => this.mapFromDatabase(task)) : []
    } catch (error) {
      console.error("Error fetching incomplete tasks:", error?.response?.data?.message || error)
      return []
    }
  }
}

export const taskService = new TaskService()