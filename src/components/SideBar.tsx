'use client'
import { ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { usePathname } from 'next/navigation';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
export default function SideBar() {

  const path = usePathname()
  return (
    <Sidebar>
      <Menu 
        menuItemStyles={{
          button : ({ level, active, disabled }) => { 
            return {
              // backgroundColor:   active ? '#f3f3f3' : undefined,
              backgroundColor: active ? 'hsl(var(--secondary))' : undefined,
              color: active ? 'hsl(var(--primary))' : undefined
            }
          }
        }}
        renderExpandIcon={({open}) => <span>{open ? (<Minus size={18} />) : (<Plus size={18}/>)}</span>}
        >
        <SubMenu label="Student" defaultOpen  >
          <MenuItem active={path === '/student/add'} component={<Link href='/student/add' />}> Add Student </MenuItem>
          <MenuItem active={path === '/student/enrollment'} component={<Link href='/student/enrollment'/>} > Enrollment</MenuItem>
          <MenuItem active={path === '/student/endrolled'} component={<Link href='/student/endrolled' />} > Endrolled Student</MenuItem>
          <MenuItem active={path === '/student/print-id'} component={<Link href='/student/print-id' />} > Print ID</MenuItem>
        </SubMenu>
      </Menu>
      <Menu
       menuItemStyles={{
        button : ({ level, active, disabled }) => { 
          return {
            // backgroundColor:   active ? '#f3f3f3' : undefined,
            backgroundColor: active ? 'hsl(var(--secondary))' : undefined,
            color: active ? 'hsl(var(--primary))' : undefined
          }
        }
      }}
      renderExpandIcon={({open}) => <span>{open ? (<Minus size={18} />) : (<Plus size={18}/>)}</span>}
      >
        <SubMenu label="Class" defaultOpen >
          <MenuItem active={path === '/class/add'} component={<Link href='/class/add' />}> Add Class </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  )
}
