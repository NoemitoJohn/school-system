import React from 'react'

export default function MarginContainer({children} : {children : React.ReactNode}) {
  return (
    <div className='p-4 h-full'>
      {children}
    </div>
  )
}
