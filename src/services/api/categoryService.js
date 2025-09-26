import { toast } from 'react-toastify'

class CategoryService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'category_c'
  }

  // Helper method to map database fields to UI fields
  mapFromDatabase(category) {
    if (!category) return null
    return {
      id: category.Id,
      name: category.name_c || category.Name || '',
      color: category.color_c || '#5B4FE5',
      icon: category.icon_c || 'Folder',
      taskCount: category.task_count_c || 0,
      createdAt: category.CreatedOn || new Date().toISOString()
    }
  }

  // Helper method to map UI fields to database fields
  mapToDatabase(categoryData) {
    const data = {}
    
    // Only include updateable fields
    if (categoryData.name !== undefined) data.name_c = categoryData.name
    if (categoryData.color !== undefined) data.color_c = categoryData.color
    if (categoryData.icon !== undefined) data.icon_c = categoryData.icon
    if (categoryData.taskCount !== undefined) data.task_count_c = categoryData.taskCount
    
    return data
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error("Error fetching categories:", response.message)
        toast.error(response.message)
        return []
      }

      if (!response.data || response.data.length === 0) {
        return []
      }

      return response.data.map(category => this.mapFromDatabase(category))
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "task_count_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response?.data) {
        throw new Error(`Category with id ${id} not found`)
      }

      return this.mapFromDatabase(response.data)
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      throw error
    }
  }

  async create(categoryData) {
    try {
      const params = {
        records: [this.mapToDatabase(categoryData)]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error("Error creating category:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed)
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
      
      throw new Error('Failed to create category')
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error)
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
        console.error("Error updating category:", response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed)
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
      
      throw new Error('Failed to update category')
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error)
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
        console.error("Error deleting category:", response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          return false
        }
      }
      
      return true
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error)
      throw error
    }
  }
}

export const categoryService = new CategoryService()