'use client'
import { Menu, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Sidebar, Menu as SMenu  , MenuItem, SubMenu } from 'react-pro-sidebar';
import { Button } from './ui/button';

export default function SideBar() {
  const path = usePathname()

  const [windowSize, setWindowSize] = useState<number>()
  const breakPoint = useMediaQueryListener(1000)
  const [hide, setHide] = useState<boolean>(false)
  const [toggled, setToggled] = useState<boolean>(false)


  useEffect(() => {
    setHide(breakPoint)
  }, [breakPoint])

  
  return (
    <div className='border-r shadow-sm'>
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
                <MenuItem active={path === '/student/enrollment'} component={<Link href='/student/enrollment'/>} > Enrollment</MenuItem>
                <MenuItem active={path === '/student/endrolled'} component={<Link href='/student/endrolled' />} > Endrolled Student</MenuItem>
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
              </SubMenu>
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
      {hide && 
        <Button variant='ghost' onClick={() => setToggled(true)} >
          <Menu color='hsl(var(--primary))' />
        </Button>
      }
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
