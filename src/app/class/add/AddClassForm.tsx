'use client'
import Dropdown from '@/components/Dropdown'
import { Label } from '@radix-ui/react-label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ClassSchema, TClassSchema } from '@/validation/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { addClass } from '@/server/actions/actions'
import toast from 'react-hot-toast'
import { TGradeLevel } from '@/components/EnrollmentSearch'

export default function AddClassForm({classes} : {classes : TGradeLevel[]}) {

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState : {errors , isSubmitting}
  } = useForm<TClassSchema>({
    resolver : zodResolver(ClassSchema)
  })

  const handleAddClassSubmit : SubmitHandler<TClassSchema> = async (data)=> {
    try {
      await addClass(data)
      toast.success('Save Successfully')
      reset()
    } catch (error) {
      toast.error('Something went wrong!')
    }
    // reset()
  }

  return (
      <form onSubmit={handleSubmit(handleAddClassSubmit)} >
        <div className='flex items-end justify-between gap-4'>
          <div className='flex gap-4 w-full'>
            <div className='flex-1'>
              <Controller 
              name='grade_level_name'
              control={control}
              render={({field, formState : {errors}}) => (
                <>
                  <Label className='text-xs'>Grade Level</Label>
                  <Dropdown label='Select Grade Level' items={classes} onChange={field.onChange} value={field.value}
                    getLabel={(props) => props.level_name}
                    getValue={(props) => props.id}
                  />
                </>
              )}
              />
            </div>
            <div className='flex-1'>
              <Label className='text-xs'>Section Name</Label>
              <Input {...register('section_name')} placeholder='Section Name' />
            </div>
            <div className='flex-1'>
              <Label className='text-xs'>School Year</Label>
              <Input {...register('school_year')} placeholder='2024-2025' />
            </div>
          </div>
          <Button type='submit' disabled={isSubmitting}>Add Class</Button>
        </div>
    </form>
  )
}
