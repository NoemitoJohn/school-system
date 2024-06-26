'use client'
import Link from 'next/link';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
export default function SideBar() {
  return (
    <Sidebar>
      <Menu>
        <SubMenu label="Student">
          <MenuItem component={<Link href='/student/add' />}> Add Student </MenuItem>
          <MenuItem component={<Link href='/student/enrollment'/>} > Enrollment</MenuItem>
          <MenuItem component={<Link href='/student/print-id' />} > Print ID</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  )
}
