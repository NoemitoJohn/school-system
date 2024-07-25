import { ChangeEvent, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HardDriveDownload } from 'lucide-react'
import useSWRMutation from 'swr/mutation'
import toast from 'react-hot-toast'
import readXlsxFile, { Row } from 'read-excel-file'
import { useRouter } from 'next/navigation'

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

export default function ModalUploadXlxs({open, onOpenChange, onHandleSuccess} : {open : boolean , onOpenChange : (open : boolean) => void, onHandleSuccess : () => void }) {

  const [file, setFile] = useState<File>()
  const {trigger, isMutating} = useSWRMutation('/api/student/xlsx', uploadXLSX)
  
  const router = useRouter()

  const handleFileInputChange = (e : ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) setFile(e.target.files[0])
  }

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

      onHandleSuccess()
    } catch (error) {
      return toast.error('Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Student File</DialogTitle>
          <DialogDescription>
            Choose an excel file to updload
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              type='file'
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileInputChange}
            />
          </div>
          <Button type="button" size="sm" className="flex items-center gap-2" disabled={isMutating}
            onClick={() =>onHandleGenerateClicked()}
          >
            <HardDriveDownload  />
            <span className='sr-only'>Generate</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}