import React from "react"
import Select from "@/components/atoms/Select"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const FilterBar = ({ 
  currentPriority, 
  onPriorityChange, 
  currentSort, 
  onSortChange,
  onClearFilters 
}) => {
  const hasActiveFilters = currentPriority !== "all" || currentSort !== "created"

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        <ApperIcon name="Filter" size={18} className="text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters:</span>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Priority:</label>
        <Select 
          value={currentPriority} 
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-32"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort by:</label>
        <Select 
          value={currentSort} 
          onChange={(e) => onSortChange(e.target.value)}
          className="w-36"
        >
          <option value="created">Created Date</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearFilters}
          className="ml-auto"
        >
          <ApperIcon name="X" size={16} className="mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}

export default FilterBar