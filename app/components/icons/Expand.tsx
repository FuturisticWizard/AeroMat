import React from 'react'
import Image from 'next/image'

const Expand = () => {
  return (
     <div className="relative  size-6 lsm:size-8">
        <Image 
            alt="Expand"
            fill
            src="/icons/icons8-expand-100.png"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
    </div>
  )
}

export default Expand