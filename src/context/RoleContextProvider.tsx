'use client'
import React, { createContext, useContext, useState } from 'react'

const RoleContext = createContext('Noemito')

export default function RoleContextProvider({children, value} : {children : React.ReactNode, value : string}) {
  // const [role,setRole] = useState('Noemito')
 
  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRoleContext() {
  return useContext(RoleContext);
}
