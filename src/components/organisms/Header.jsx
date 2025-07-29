import React from "react"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Header = ({ onSearch, onQuickAdd, title = "TaskFlow" }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search tasks..."
            className="w-80"
          />
          <Button onClick={onQuickAdd} className="flex items-center gap-2">
            <ApperIcon name="Plus" size={18} />
            <span className="hidden sm:inline">Quick Add</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header