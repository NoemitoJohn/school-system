'use client'
import { OPTeacherSchema, TeacherSchema, TTeacherSchema } from '@/validation/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { Label } from '../../../../components/ui/label';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { KeyRound } from 'lucide-react';
import Dropdown from '../../../../components/Dropdown';
import { TSection } from '../../../../components/EnrollmentSearch';

type TTeacherModalProps<> =  {
  classes : TSection[]
  open : boolean
  handleTeacherSubmit: SubmitHandler<TTeacherSchema>
  onOpenChange: (value : boolean) => void
  values? : any
}

export default function AddTeacherModal({classes, open, handleTeacherSubmit, onOpenChange, values} : TTeacherModalProps) {

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState : {isSubmitting}
  } = useForm<TTeacherSchema>({
    resolver: values ? zodResolver(OPTeacherSchema) : zodResolver(TeacherSchema),
    values
  })
  const handleGenPassword = () => {
    const gen = nanoid(11);
    setValue('password', gen)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teacher Information</DialogTitle>  
        </DialogHeader>
          <div className="grid px-2 py-3">
            <form onSubmit={handleSubmit(handleTeacherSubmit)}>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label className="text-right ">Profile Picture</Label>
                <Input {...register('profile')} className="col-span-3" type='file' placeholder="First Name" />
                <Label className="text-right ">First Name</Label>
                <Input {...register('first_name')} className="col-span-3" placeholder="First Name" />
                <Label className="text-right ">Last Name</Label>
                <Input {...register('last_name')} className="col-span-3" placeholder="Last Name" />
                <Label className="text-right ">Email</Label>
                <Input {...register('email')} className="col-span-3" placeholder="example@gmail.com" type="email" />
                {!values && 
                  <>
                    <Label className="text-right ">Password</Label>
                    <div className="col-span-3 flex items-center gap-2">
                        <Input {...register('password')} className="col-span-3"  />
                        <Button size='sm' type='button' onClick={handleGenPassword}><KeyRound size={15}/></Button>
                    </div>
                  </>
                }
                <Label className="text-right ">Phone Number</Label>
                <Input {...register('phone_number')} className="col-span-3" placeholder="09xxxxxxxx" />
                {!values &&

                  <Controller
                    name='section'
                    control={control}
                    render={({field, formState}) => (
                      <>
                        <Label className="text-right ">Section</Label>
                        <div className="col-span-3">
                          <Dropdown label="Select Class" items={classes} onChange={field.onChange} value={field.value}
                            getValue={(p) => p.id}
                            getLabel={(p) => `${p.section_name} (${p.school_year})`}
                            />
                        </div>
                      </>
                    )}
                  />
                }
              </div>
              <div className="flex justify-end mt-2">
                <Button size='sm' type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 
                    (<span>Loading</span>) :
                    (<span>Submit</span>)
                  }
                </Button>
              </div>
            </form>
          </div>
      </DialogContent>
    </Dialog>
  )
}
