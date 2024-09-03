import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScannerCodeSchema, TScannerCodeSchema } from '@/validation/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import { ScanBarcode } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type TScannerModal = DialogProps & {
  onSubmit? : () => void
}

type TScannerResponse = {
  full_name: string,
  grade_level: string, 
  profile_url: string | null, 
  school_year : string
}
export default function ScannerModal({ onSubmit: onSubmit ,...props} : TScannerModal) {
  const [studentInfo, setStudentInfo] = useState<TScannerResponse>()

  const {register, handleSubmit, setFocus, resetField, setValue} = useForm<TScannerCodeSchema>({
    resolver: zodResolver(ScannerCodeSchema)
  })

  const handleScannerSubmit : SubmitHandler<TScannerCodeSchema> = async (data) =>{
    // return console.log(JSON.stringify(data))
    const request = await fetch('/api/student/attendance', {
      method: 'POST',
      body: JSON.stringify(data)
    })

    if(!request.ok) { return toast.error('Something went wrong')}

    const response : {success: boolean, data :TScannerResponse} = await request.json()
    
    if(!response.success) { return toast.error('Cant find student info in enrolled student list', {duration : 8000}) }
    
    setStudentInfo(response.data)
    
    resetField('code')
    setFocus('code')
  }

  return (
    <Modal {...props}>
      <DialogHeader>
        <DialogTitle className='text-base'>
          Student Attendance
        </DialogTitle>
        <DialogDescription>Scan Qr Code</DialogDescription>
      </DialogHeader>
      {studentInfo && 
        <div className='grid grid-cols-2 grid-rows-4 gap-3 '>
          {studentInfo.profile_url ? 
          ( 
            <div className='relative row-span-4 w-full'>
              <Image src={studentInfo.profile_url} loader={({src}) => src} className='object-cover' fill alt='profile_picture' />
            </div>
          ) : 
          (<div className='w-full bg-slate-500 row-span-4 flex justify-center items-center'>
            <p className='uppercase font-semibold text-zinc-200'>No image</p>
          </div> )
        }
          <div className='flex w-full flex-col justify-center'>
            <p>{studentInfo.full_name}</p>
          </div>
          <div className='flex w-full flex-col justify-center'>
            <p>{studentInfo.grade_level}</p>
          </div>
          <div className='flex w-full flex-col justify-center'>
            <p>{studentInfo.school_year}</p>
          </div>
        </div>
      }
      {/* Scanner form */}
      <form onSubmit={handleSubmit(handleScannerSubmit)}>
        <div className='flex gap-2'>
          <Input {...register('code')} placeholder='Scanner Code'/>
          <Button size='sm' type='submit' onClick={() => setValue('date', new Date())}><ScanBarcode size={18}/></Button> 
        </div>
      </form>
    </Modal>
  )
}
