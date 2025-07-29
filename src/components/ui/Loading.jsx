import React from "react"

const Loading = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Task Items Skeleton */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-card border border-gray-100">
          <div className="flex items-start gap-4">
            {/* Checkbox skeleton */}
            <div className="w-5 h-5 bg-gray-200 rounded border-2 flex-shrink-0 mt-1" />
            
            <div className="flex-1 space-y-3">
              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              
              {/* Description skeleton */}
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              
              {/* Badges skeleton */}
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 rounded-full px-3 py-1 w-16" />
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
            </div>
            
            {/* Action buttons skeleton */}
            <div className="flex gap-1">
              <div className="w-8 h-8 bg-gray-100 rounded-full" />
              <div className="w-8 h-8 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading