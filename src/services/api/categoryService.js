import categoriesData from "@/services/mockData/categories.json"

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CategoryService {
  constructor() {
    this.categories = [...categoriesData]
  }

  async getAll() {
    await delay(200)
    return [...this.categories]
  }

  async getById(id) {
    await delay(150)
    const category = this.categories.find(c => c.id === id)
    if (!category) {
      throw new Error(`Category with id ${id} not found`)
    }
    return { ...category }
  }

  async create(categoryData) {
    await delay(300)
    
    const newCategory = {
      id: `category_${Date.now()}`,
      name: categoryData.name,
      color: categoryData.color || "#5B4FE5",
      icon: categoryData.icon || "Folder",
      taskCount: 0,
      createdAt: new Date().toISOString()
    }
    
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, updateData) {
    await delay(250)
    
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`)
    }
    
    const updatedCategory = {
      ...this.categories[index],
      ...updateData
    }
    
    this.categories[index] = updatedCategory
    return { ...updatedCategory }
  }

  async delete(id) {
    await delay(200)
    
    const index = this.categories.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Category with id ${id} not found`)
    }
    
    const deletedCategory = this.categories.splice(index, 1)[0]
    return { ...deletedCategory }
  }
}

export const categoryService = new CategoryService()