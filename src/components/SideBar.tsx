'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { usePathname } from 'next/navigation';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
export default function SideBar() {

  const path = usePathname()
  // console.log(path)
  //#f3f3f3 active color
  return (
    <Sidebar>
      <Menu 
        menuItemStyles={{
          button : ({ level, active, disabled }) => { 
            return {
              backgroundColor: active ? '#f3f3f3' : undefined,
            }
          }
        }}>
        <SubMenu label="Student" defaultOpen >
          <MenuItem  active={path === '/student/add'} component={<Link href='/student/add' />}> Add Student </MenuItem>
          <MenuItem active={path === '/student/enrollment'} component={<Link href='/student/enrollment'/>} > Enrollment</MenuItem>
          <MenuItem active={path === '/student/endrolled'} component={<Link href='/student/endrolled' />} > Endrolled Student</MenuItem>
          <MenuItem active={path === '/student/print-id'} component={<Link href='/student/print-id' />} > Print ID</MenuItem>
        </SubMenu>
      </Menu>
      <Menu
        menuItemStyles={{
          button : ({ level, active, disabled }) => { 
            return {
              backgroundColor: active ? '#f3f3f3' : undefined,
            }
          }
        }}
      >
        <SubMenu label="Class" defaultOpen >
          <MenuItem active={path === '/class/add'} component={<Link href='/class/add' />}> Add Class </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  )
}
