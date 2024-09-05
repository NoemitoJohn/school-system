'use client'
import { Menu, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar, Menu as SMenu  , MenuItem, SubMenu } from 'react-pro-sidebar';
import { Button } from './ui/button';
import useSWRMutation from 'swr/mutation';
import toast from 'react-hot-toast';

function logoutHandler(url: string) {
  return fetch(url, {
    method: 'POST'
  })
}

export default function SideBar() {
  const router = useRouter()
  const path = usePathname()
  const breakPoint = useMediaQueryListener(768)
  
  const {trigger} = useSWRMutation('/api/auth/logout',logoutHandler)

  const [hide, setHide] = useState<boolean>(true)
  const [toggled, setToggled] = useState<boolean>(false)

  const hadleLogout = async () => {
    const resquest = await trigger()
    if(!resquest.ok) { return toast.error('Something went wrong') }

    const response = await resquest.json()
    if(!response.success) { return toast.error('Something went wrong') }

    router.refresh()
  }
  useEffect(() => {
    setHide(breakPoint)
  }, [breakPoint])

  
  return (
    <div className='h-full'>
      <div className={`h-full ${hide ? `${toggled ? 'fixed z-30 bg-[#f9fafb] left-0' : 'fixed z-30 bg-[#f9fafb] left-[-250px] '} `: ''}`} >    
          <Sidebar backgroundColor='#f9fafb' 
            rootStyles={{
              border : 0,
              height : '100%'
            }}
            >
            <SMenu 
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
                <MenuItem  active={path === '/student/enrollment'} component={<Link href='/student/enrollment'/>} > Student List</MenuItem>
                <MenuItem active={path === '/student/endrolled'} component={<Link href='/student/endrolled' />} > Endrolled Students</MenuItem>
                <MenuItem active={path === '/student/attendance'} component={<Link href='/student/attendance' />} >Attendance</MenuItem>
                <MenuItem active={path === '/student/print-id'} component={<Link href='/student/print-id' />} > Print ID</MenuItem>
              </SubMenu>
            </SMenu>
            <SMenu
              menuItemStyles={{
                button : ({ level, active, disabled }) => { 
                  return {
                    backgroundColor: active ? 'hsl(var(--secondary))' : undefined,
                    color: active ? 'hsl(var(--primary))' : undefined
                  }
                }
              }}
              renderExpandIcon={({open}) => <span>{open ? (<Minus size={18} />) : (<Plus size={18}/>)}</span>}
            >
              <SubMenu label="Class" defaultOpen >
                <MenuItem active={path === '/class/add'} component={<Link href='/class/add' />}> Add Class </MenuItem>
                <MenuItem active={path === '/class/sections'} component={<Link href='/class/sections' />}> Sections & Advisory </MenuItem>
              </SubMenu>
            </SMenu>
            <SMenu
              menuItemStyles={{
                button : ({ level, active, disabled }) => { 
                  return {
                    backgroundColor: active ? 'hsl(var(--secondary))' : undefined,
                    color: active ? 'hsl(var(--primary))' : undefined
                  }
                }
              }}
              renderExpandIcon={({open}) => <span>{open ? (<Minus size={18} />) : (<Plus size={18}/>)}</span>}
            >
              <SubMenu label="Faculty" defaultOpen >
                <MenuItem active={path === '/faculty/teacher'} component={<Link href='/faculty/teacher' />}>Teachers </MenuItem>
                {/* <MenuItem active={path === '/class/sections'} component={<Link href='/class/sections' />}> Sections & Advisory </MenuItem> */}
              </SubMenu>
            </SMenu>
            <SMenu>
              <MenuItem onClick={() => hadleLogout()} component={<button className='w-full text-left'/>}>Logout</MenuItem>

            </SMenu>
          </Sidebar>
          
          { toggled && 
          <div 
            className='fixed top-0 left-0 right-0 bottom-0 z-[1] bg-black opacity-30'
            onClick={() => setToggled(false)}
          >
          </div>
          }
      </div>
      {hide && (
        <div>
          <Button  variant='ghost' className='rounded-lg' onClick={() => setToggled(true)} >
            <Menu color='hsl(var(--primary))' />
          </Button>
        </div>
      )
      }
      {/* loading spinner */}
      {/* <Button size='sm' >
          <svg aria-hidden="true" className="w-full h-full text-primary animate-spin dark:text-gray-600 fill-secondary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </Button> */}

    </div>
  )
}


function useMediaQueryListener(breakPoint : number) {
  'use client'
  const [windowSize, setWindowSize] = useState<number>()
  // const [toggled, setToggled] = useState(false)
  useEffect(() => {
    function updateSize () {
      setWindowSize(window.innerWidth)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize); // clean up
  }, [])

  if(windowSize && windowSize < breakPoint ) {
    // console.log(84, window)
    return true;
  }
  else {
    // console.log(86, window)
    return false;
  }


}
