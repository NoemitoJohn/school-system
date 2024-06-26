'use client'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import { useFormStatus } from 'react-dom'
import { Save } from 'lucide-react';
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from './ui/button'
import { StudentSchema, TStudent } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStudent } from "@/actions/actions";

export default function StudentForm() {
  const {
    register,
    handleSubmit,
    control,
    formState : {errors, isSubmitting}
  } = useForm<TStudent>({
    resolver : zodResolver(StudentSchema)
  })

  const onSubmit : SubmitHandler<TStudent> = async (data) => {
    const response = await addStudent(data)
    if(response?.error) {
    }
  }

  return (
    
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="border-slate-400 border-b">
          <p className='font-bold'>Student Infomation</p>
        </div>
        <div className='flex gap-4 mt-2'> {/* student name 1st section*/}
          <div className='flex-1'>
            <Label className={`text-xs ${errors.last_name && 'text-red-500'}`}>Last Name</Label>
            <Input {...register("last_name", { required: true })} placeholder='Last Name'/>
          </div>
          <div className='flex-1'>
            <Label className={`text-xs ${errors.first_name && 'text-red-500'}`}>First Name</Label>
            <Input {...register("first_name", { required: true })} placeholder='First Name'/>
          </div>
          <div className='flex-1'>
            <Label className={`text-xs ${errors.middle_name && 'text-red-500'}`}>Middle Name</Label>
            <Input {...register("middle_name", { required: true })} placeholder='Middle Name'/>
          </div>
          <div className='flex-1'>
            <Label className={`text-xs ${errors.ext_name && 'text-red-500'}`}>Name Extension (eg Jr)</Label>
            <Input {...register("ext_name")} placeholder='Extension Name'/>
          </div>
        </div>
        <div className='flex gap-4'> {/* student name 2nd section*/}
          <div className='flex-1'>
          <Controller
            name="gender"
            rules={{required : true}}
            control={control}
            render={({field, formState : {errors}}) => (
              <>
                <Label className={`text-xs ${errors.gender && 'text-red-500'}`}>Sex</Label>
                <Select onValueChange={field.onChange} value={field.value}  >
                  <SelectTrigger >
                    <SelectValue placeholder="Select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MALE">MALE</SelectItem>
                      <SelectItem value="FEMALE">FEMALE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </>
            )}
          />
          </div>
          <div className='flex-1'>
            <Label className={`text-xs ${errors.birthdate && 'text-red-500'}`}>Birthday</Label>
            <Input {...register("birthdate", { required: true })} type="date" className='block' />
          </div>
          <div className='flex-1'>
            <Label className={`text-xs ${errors.religion && 'text-red-500'}`}>Religion</Label>
            <Input {...register("religion", { required: true })} placeholder='Religion'/>
          </div>
        </div>
      </div>

      <div className='mt-3'>
        <div className="border-slate-400 border-b">
          <p className='font-bold'>Parent Information</p>
        </div>
        <p className='font-medium text-xs mt-2'>Father's Name</p>
        <div className="flex gap-4">
          <div className='flex-1'>
            <Label className='text-xs'>Last Name</Label>
            <Input {...register("parent.father.last_name")}  placeholder='Last Name'/>
          </div>
          <div className='flex-1'>
            <Label className='text-xs'>First Name</Label>
            <Input {...register("parent.father.first_name")}  placeholder='First Name'/>
          </div>
          <div className='flex-1'>
            <Label className='text-xs'>Middle Name</Label>
            <Input {...register("parent.father.middle_name")}  placeholder='Middle Name'/>
          </div>
          <div className='flex-1'>
            <Label className='text-xs'>Name Extension (eg Jr)</Label>
            <Input  {...register("parent.father.ext_name")} placeholder='Extension Name'/>
          </div>
        </div>
        <p className='font-medium text-xs mt-2'>Mother's Maiden Name</p>
        <div className="flex gap-4">
          <div className='flex-1'>
            <Label className='text-xs'>Last Name</Label>
            <Input {...register("parent.mother.last_name")} placeholder='Last Name'/>
          </div>
          <div className='flex-1'>
            <Label className='text-xs'>First Name</Label>
            <Input {...register("parent.mother.first_name")}  placeholder='First Name'/>
          </div>
          <div className='flex-1'>
            <Label className='text-xs'>Middle Name</Label>
            <Input  {...register("parent.mother.middle_name")} placeholder='Middle Name'/>
          </div>
        </div>
      </div>

      <div className='mt-3'>
        <div className="border-slate-400 border-b">
          <p className='font-bold'>Home Address</p>
        </div>
        <div className="flex flex-col gap-1 mt-2">

          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-xs">Province</Label>
              <Input  {...register("address.province")} placeholder="Province"/>
            </div>
            <div className="flex-1">
              <Label className="text-xs">Municipality/City</Label>
              <Input {...register("address.city")} placeholder="Municipality/City"/>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-xs">Barangay</Label>
              <Input {...register("address.barangay")} placeholder="Barangay"/>
            </div>
            <div className="flex-1">
              <Label className="text-xs">House#/Street/Sitio/Purok</Label>
              <Input {...register("address.house_num")} placeholder="House #/Street/Sitio/Purok"/>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="border-slate-400 border-b">
          <p className='font-bold'>Contact Number of Parent or Guardian</p>
        </div>
        <div className="flex mt-2">
          <div>
            <Label className={`text-xs ${errors.contact_num && 'text-red-500'}`}>Phone Number</Label>
            <Input {...register("contact_num", {required : true})}  placeholder="09xxxxxxxx"/>
          </div>
        </div>

      </div>
      <div className="flex justify-center">

        <Button type='submit'>
          <div className="flex items-center gap-1">
            <Save />
              {isSubmitting ?  <p>Loading...</p> : <p>Save</p>}
          </div>
        </Button>
      </div>

    </form>
  )
}
