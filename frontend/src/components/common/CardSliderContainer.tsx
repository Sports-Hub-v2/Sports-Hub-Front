import React from "react"

interface CardSliderContainerProps {
  children: React.ReactNode
}

const CardSliderContainer: React.FC<CardSliderContainerProps> = ({ children }) => {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide px-1 py-2">
        {children}
      </div>
    </div>
  )
}

export default CardSliderContainer
