'use client'
import { ImageOff } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';


type TAttendanceHistory = {
  is_time_out: boolean; 
  time_in: string;
  time_out: string;
  date_time_stamp: string;
}

type TScanerResponse = {
  full_name: string;
  grade_level: string;
  profile_url: string;
  history: Array<TAttendanceHistory>
  school_year: string;
  section_name: string;
}

export default function Scanner() {
  const [scannerCode, setScannerCode] = useState('127873170125'); 
  const [studentInfo, setStudentInfo] = useState<TScanerResponse>();
  const [historyTimeIn, setHistoryTimeIn] = useState<TAttendanceHistory[]>();
  const [historyTimeOut, setHistoryTimeOut] = useState<TAttendanceHistory[]>();
  
  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
    };
  }, [scannerCode]);

  const handleKeyDown = async (event: KeyboardEvent) => {
    if (event.key.length === 1) {
      setScannerCode((prevBuffer) => prevBuffer + event.key);
    }

    if (event.key === 'Enter') {
      console.log(42, scannerCode)

      const request = await fetch('api/student/attendance',{
        method: 'POST',
        body: JSON.stringify({code : scannerCode, date: new Date()})
      })
      
      if(!request.ok) { 
        setScannerCode('')
        return toast.error('Something went wrong!')
      }
      
      const response : {success: boolean, data: TScanerResponse, message: string} = await request.json()
      if(!response.success) { 
        setScannerCode('')
        return toast.error(response.message)
      }
      
      const timeOut = response.data.history.filter((v) => v.is_time_out)
      const timeIn = response.data.history.filter((v) => !v.is_time_out)

      setHistoryTimeIn(timeIn)
      setHistoryTimeOut(timeOut)
      setStudentInfo(response.data)
      
      setScannerCode('')
    }
  }

  return (
    <>
      <div className='grid grid-cols-3 h-full gap-4 '>
        <div className='row-span-4'>
          {studentInfo?.profile_url ? 
            ( <img className='h-full' src={studentInfo?.profile_url} alt=""  /> )
          :
            (
              <div className='h-full bg-zinc-600 flex justify-center items-center'>
                <ImageOff className='text-white' size={60}/>
              </div>
            )}
        </div>
        <div className= 'col-span-2 row-span-4'>
          <div className='grid grid-cols-2 gap-5'>
            <div className='col-span-2 flex flex-col justify-end '>
              <p className='text-4xl   font-sans text-slate-900 font-extrabold uppercase'>{studentInfo?.full_name}</p>
            </div>
            <div className='col-span-2  p-1'>
              <p className='text-2xl font-bold font-sans   text-slate-500 uppercase'>Full Name</p>
            </div>
            <div className='col-span-2 flex flex-col justify-end '>
              <p className='text-4xl   font-sans text-slate-900 font-extrabold uppercase'>{studentInfo?.grade_level}</p>
            </div>
            <div className='col-span-2  p-1'>
              <p className='text-2xl font-bold font-sans  text-slate-500 uppercase'>Grade Level</p>
            </div>
            <div className='col-span-2 flex flex-col justify-end '>
              <p className='text-4xl   font-sans text-slate-900 font-extrabold uppercase'>{studentInfo?.section_name}</p>
            </div>
            <div className='col-span-2  p-1'>
              <p className='text-2xl font-bold font-sans   text-slate-500 uppercase'>Section</p>
            </div>
            <div className='col-span-2 flex flex-col justify-end '>
              <p className='text-4xl   font-sans text-slate-900 font-extrabold uppercase'>{studentInfo?.school_year}</p>
            </div>
            <div className='col-span-2  p-1'>
              <p className='text-2xl font-bold font-sans   text-slate-500 uppercase'>School year</p>
            </div>
          </div>
        </div>
        <div className='row-span-6 '>
          <div className='grid grid-cols-2 '>
            <div >
              <p className='text-2xl font-sans text-center text-slate-500  font-extrabold uppercase'>TIME IN</p>
              {historyTimeIn && historyTimeIn.map(v => (
                <p key={v.time_in} className='text-2xl font-sans text-center text-slate-900 font-extrabold uppercase'>
                  {new Intl.DateTimeFormat('en-US', { timeStyle: 'short'}).format(new Date(v.date_time_stamp))}
                </p>
              ))}
            </div>
            <div> 
              <p className='text-2xl font-sans text-center text-slate-500  font-extrabold uppercase'>TIME OUT</p>
              {historyTimeOut && historyTimeOut.map(v => (
                <p key={v.time_out} className='text-2xl font-sans text-center text-slate-900 font-extrabold uppercase'>
                  {new Intl.DateTimeFormat('en-US', { timeStyle: 'short'}).format(new Date(v.date_time_stamp))}
                </p>
              ))}
            </div>    
          </div>
        </div>
      </div>
      
    </>
  )
}
