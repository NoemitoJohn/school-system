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


export type TxlsxStudent = {
  lrn : string
  full_name :string
  gender :string
  birth_date :string
  age :string
  mother_tongue : string
  religion : string
  barangay : string
  city_municipality : string
  province : string
  father_name : string
  mother_name : string
  first_name : string
  last_name : string
  middle_name : string
}

type XLSXkeys = Array<keyof TxlsxStudent>

function getStudentFromRow(rows : Row[]) {
  const keys = [
    'lrn',
    'full_name',
    'gender',
    'birth_date',
    'age',
    'mother_tongue',
    'religion',
    'barangay',
    'city_municipality',
    'province',
    'father_name',
    'mother_name'
  ]

  let index = 6
  const studentsTemp :any = []

  while (true) { 
    
    const row = rows[index]
    
    if(!row) break;
    
    const filterNull = row.filter(c => c != null) // L 14

    if(filterNull.length <= 1) break;

    if(filterNull.length < 3) { index++ ; continue };
    
    const studentInfo = filterNull.slice(0, filterNull.length -2);
    const temp : Record<string, string> = {}
    for(let i = 0; i < studentInfo.length; i++){
      temp[keys[i]] = studentInfo[i] as string
    }

    studentsTemp.push(temp)
    index++
  }

  const students : TxlsxStudent[] = studentsTemp
  return students
} 

async function parseXLSX(file : File) {
  try {
    const rows = await readXlsxFile(file)
    const studentTemp = getStudentFromRow(rows)
    
    const students = studentTemp.map(s => {
      const name = transformName(s)
      return {
        ...s, ...name,
        gender : s.gender === 'M' ? 'MALE' : 'FEMALE'
      }
    })
    
    // console.log(students)
    return students
  } catch (error) {
    throw 'Something went wrong during parsing'
  }
}

function transformName (student : TxlsxStudent) { 
  const names = student.full_name.split(',')
  const keys : XLSXkeys  = ['last_name', 'first_name', 'middle_name']
  
  const name : Partial<Record<keyof TxlsxStudent, string>> = {}

  for (const i in names) {
    const trim = names[i].trim()
    if(trim == '-') 
      name[keys[i]] = '';
    else
      name[keys[i]] = trim;
  }

  return name
}

async function uploadXLSX(url : string, {arg} : {arg : {students : Array<TxlsxStudent>}}) {
  return fetch(url, {
    method : 'POST',
    body : JSON.stringify(arg.students) 
  })
}



export default function StudentForm({provinces, city, barangay} : {provinces : TProvince[], city : TCity[], barangay : TBarangay[]}) {
  const [file, setFile] = useState<File>()
  const {trigger, isMutating} = useSWRMutation('/api/student/xlsx', uploadXLSX)
  const router = useRouter()
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

  const onHandleGenerateClicked = async () => {
    if(!file) return;
    try {
      const students = await parseXLSX(file)
      // const result = await 
      // console.log(result)
      const result = await toast.promise(trigger({students : students}), {
        loading : 'Please wait',
        success : (data) => {
          if(!data.ok){
            throw new Error(data.statusText);
          }
          return "Saved!";
        },
        error : (err : Error) => err.message
      })
      // console.log(result)
      if(result.ok) router.refresh()
        
    } catch (error) {
      
    }
    // console.log(content)
  }

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

  const handleFileInputChange = (e : ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) setFile(e.target.files[0])
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
          <div className="flex items-end gap-2">

            <div className="inline-block mt-2">
              <Label className="text-xs">Exel File</Label>
              <Input onChange={handleFileInputChange} type="file"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            </div>
              <Button variant='link' className='px-0' size='sm' type='button'
                onClick={() => onHandleGenerateClicked()}
                disabled={isMutating}
              >Generate</Button>
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
            <Save />
              {isSubmitting ?  <p>Loading...</p> : <p>Save</p>}
          </div>
        </Button>
      </div>

    </form>
  )
}
