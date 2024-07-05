'use client'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { useRouter } from 'next/navigation'

export default function Modal({children, title, description} : {children: React.ReactNode, title : string, description? : string}) {
  
  const [open, setOpen] = useState(true)
  
  const router = useRouter()
  
  useEffect(() => {
    if(!open){
      router.back()
    }
  },[open])


  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            { description && 
            <DialogDescription>
              {description}
            </DialogDescription>
            }
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </div>
  )
}
