'use client'
import { useForm, SubmitHandler, Controller } from "react-hook-form"
import readXlsxFile, { Row } from 'read-excel-file'
import { Save } from 'lucide-react';
import { Input } from './ui/input'
import { Label } from './ui/label'
import toast from 'react-hot-toast';
import { Button } from './ui/button'
import { StudentSchema, TStudent } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { addStudent } from "@/server/actions/actions";
import Dropdown from "./Dropdown";
import { TBarangay, TCity, TProvince } from "@/app/student/add/page";
import { ChangeEvent, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";




export default function StudentForm({provinces, city, barangay} : {provinces : TProvince[], city : TCity[], barangay : TBarangay[]}) {
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState : {errors, isSubmitting}
  } = useForm<TStudent>({
    resolver : zodResolver(StudentSchema)
  })



  const onSubmit : SubmitHandler<TStudent> = async (data) => {

    const file =  data.profile_pic?.[0] as File
    const formData = new FormData()
    formData.append('fileImage', file)
    const response = await addStudent({...data, profile_pic : formData})
    
    if(response?.error) {
      return toast.error(response.error)
    }

    toast.success('Save Successfully')
    reset()
  }


  const proviceCode = watch('address.province', '')
  const cityCode = watch('address.city', '')

  const cities = city.filter(c => c.province_code === proviceCode)
  const barangays = barangay.filter(b => b.city_code === cityCode)
  return (

    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="border-slate-400 border-b">
          <p className='font-bold'>Student Infomation</p>
        </div>
        <div className="flex justify-between">
          <div className="inline-block mt-2">
            <Label className="text-xs">Student Photo</Label>
            <Input {...register("profile_pic")} type="file" />
          </div>
        </div>
        <div className='flex gap-4 mt-2'> {/* student name 1st section*/}
          <div className='flex-1'>
            <Label className={`text-xs ${errors.lrn && 'text-red-500'}`}>LRN</Label>
            <Input {...register("lrn", { required: true })} placeholder='Last Name'/>
          </div>
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
                <Dropdown items={['MALE', 'FEMALE']} onChange={field.onChange} value={field.value} label="Select a gender"/>
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
        <p className='font-medium text-xs mt-2'>Father&apos;s Name</p>
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
        <p className='font-medium text-xs mt-2'>Mother&apos;s Maiden Name</p>
        
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
        <p className='font-medium text-xs mt-2'>Guardian&apos;s Name</p>
        <div className="flex gap-4">
          <div className='flex-1'>
            <Label className='text-xs'>Last Name</Label>
            <Input {...register("parent.guardian.last_name")} placeholder='Last Name'/>
          </div>
          <div className='flex-1'>
            <Label className='text-xs'>First Name</Label>
            <Input {...register("parent.guardian.first_name")}  placeholder='First Name'/>
          </div>
          <div className='flex-1'>
            <Label className='text-xs'>Middle Name</Label>
            <Input  {...register("parent.guardian.middle_name")} placeholder='Middle Name'/>
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
            
            <Controller
              name="address.province"
              // rules={{required : true}}
              control={control}
              render={({field, formState : {errors}}) => (
                <>
                  <Label className={`text-xs ${errors.address?.province && 'text-red-500'}`}>Province</Label>
                  <Dropdown items={provinces} onChange={field.onChange} value={field.value} 
                    label="Select provinces"
                    getLabel={ (p) => p.province_name }
                    getValue={ (p) => p.province_code }
                  />
                </>
              )}
            />

            </div>
            <div className="flex-1">
              <Controller
                name="address.city"
                // rules={{required : true}}
                control={control}
                render={({field, formState : {errors}}) => (
                  <>
                    <Label className={`text-xs ${errors.address?.city && 'text-red-500'}`}>Municipality/City</Label>
                    <Dropdown items={cities} onChange={field.onChange} value={field.value} 
                      label="Select City"
                      getLabel={ (p) => p.city_name }
                      getValue={ (p) => p.city_code }
                    />
                  </>
                )}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Controller
                name="address.barangay"
                // rules={{required : true}}
                control={control}
                render={({field, formState : {errors}}) => (
                  <>
                    <Label className={`text-xs ${errors.address?.barangay && 'text-red-500'}`}>Barangay</Label>
                    <Dropdown items={barangays} onChange={field.onChange} value={field.value} 
                      label="Select Barangay"
                      getLabel={ (p) => p.brgy_name }
                      getValue={ (p) => p.brgy_code }
                    />
                  </>
                )}
              />
              {/* <Label className="text-xs">Barangay</Label>
              <Input {...register("address.barangay")} placeholder="Barangay"/> */}
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

        <Button type='submit' disabled={isSubmitting}>
          <div className="flex items-center gap-1"> 
            <Save size={20}/>
              {isSubmitting ?  <p>Loading...</p> : <p>Save</p>}
          </div>
        </Button>
      </div>

    </form>
  )
}
