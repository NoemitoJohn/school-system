'use client'
import Dropdown from '@/components/Dropdown'
import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { StudentAttendanceSchema, TStudentAttendanceSchema } from '@/validation/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {ChevronUp, CirclePlus, ScanBarcode } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { TStudentsAttendance } from './page'
import { Input } from '@/components/ui/input'


export default function Attendance({students} : {students : TStudentsAttendance}) {
  
  const [openPopover, setOpenPopOver] = useState(false)
  const [openManualModal, setManualModal] = useState(false)
  const [openScannerModal, setOpenScannerModal] = useState(false)
  const scannerInputRef = useRef<HTMLInputElement>(null)
  const popoverTriggerRef = useRef<HTMLButtonElement>(null)


  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    formState : {errors} } 
    = useForm<TStudentAttendanceSchema>({
    resolver: zodResolver(StudentAttendanceSchema)
  })

  const handleStudentAttendanceSubmit : SubmitHandler<TStudentAttendanceSchema> = (formdata) => {

  }

  return (
    <div className='mt-3'>
      <div className='flex justify-end gap-2'>
        <Button size='sm' className='flex gap-2' onClick={() => setOpenScannerModal(true)}>
          <ScanBarcode size={18}/>
            Scanner
        </Button>
        <Button size='sm' className='flex gap-2' onClick={() => setManualModal(true)}>
            <CirclePlus size={18}/>
            Manual
        </Button>
      </div>
      <div>
        {/* Manual modal */}
        <Modal open={openManualModal} onOpenChange={setManualModal}>
          <DialogHeader>
            <DialogTitle className='text-base'>
              Student Attendance
            </DialogTitle>
            <DialogDescription>Please fill up the form</DialogDescription>
          </DialogHeader>
            <form onSubmit={handleSubmit(handleStudentAttendanceSubmit)} >
              <div className='grid grid-cols-4 gap-2'>
                <Popover open={openPopover} onOpenChange={setOpenPopOver}>
                  <PopoverTrigger asChild>
                  <Button
                    ref={popoverTriggerRef}
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between col-span-3"
                  >
                    { getValues().student_name ?  getValues().student_name : 'Search Student' }
                    <ChevronUp className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                  </PopoverTrigger>
                  <PopoverContent className={`${popoverTriggerRef.current ? 'w-[' +popoverTriggerRef.current.clientWidth.toString()+ 'px]' : 'w-[500px]'} p-1`}>
                    <Command>
                      <CommandInput placeholder="Search Student..."/>
                      <CommandList>
                        <CommandEmpty>No Student found.</CommandEmpty>
                        <CommandGroup>
                          {students && students.map((stu) =>(
                            <CommandItem key={stu.student_id} value={stu.full_name}
                              onSelect={() => {
                                setValue('student_name', stu.formated_full_name)
                                setValue('student_id', stu.student_id)
                                setValue('section_id', stu.section_id)
                                setOpenPopOver(false)
                              }}
                            >
                              {stu.formated_full_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Controller 
                  name='is_time_out'
                  control={control}
                  render={({field, formState : {errors}}) => (
                    <Dropdown items={[ {value : "0", label: 'TIME IN'}, {value : "1" , label: 'TIME OUT'},]}
                      onChange={field.onChange}
                      label='IN/OUT'
                      getLabel={(v) => v.label}
                      getValue={(v) => v.value }
                    />
                  )}
                />
                <div className='col-span-3'></div>
                <Button type='submit' size='sm'>Submit</Button>
              </div>
            </form>
        </Modal>
        {/* Scanner modal */}
        {openScannerModal &&
          <Modal open={openScannerModal} onOpenChange={setOpenScannerModal}>
            <DialogHeader>
              <DialogTitle className='text-base'>
                Student Attendance
              </DialogTitle>
              <DialogDescription>Scan Qr Code</DialogDescription>
            </DialogHeader>
            <div className='grid grid-cols-2 grid-rows-4 gap-3'>
              <div className='w-full h-[200px] bg-slate-500 row-span-4'></div>
              <p className='text-ellipsis'>Noemito John Lacanaria</p>
              <p>Noemito John Lacanaria</p>
              <p>Noemito John Lacanaria</p>
              <p>Noemito John Lacanaria</p>
            </div>
            {/* Scanner form */}
            <form>
              <div className='flex gap-2'>
                <Input ref={scannerInputRef} placeholder='Scanner Code'/>
                <Button size='sm' type='submit'><ScanBarcode size={18}/></Button> 
              </div>
            </form>
          </Modal>
        }
      </div>
    </div>
  )
}
