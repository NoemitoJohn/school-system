import Modal, { ModalProps } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogProps } from '@radix-ui/react-dialog';
import { FileCog, KeyRound } from 'lucide-react';
import { nanoid } from 'nanoid';
import React from 'react'
import { useForm } from 'react-hook-form';

interface TUploadModalProps extends DialogProps {
  handleOnSubmit: (data: { password: string, file: FileList }) => void
}

export default function UploadTeacherModal({ open, onOpenChange, handleOnSubmit }: TUploadModalProps) {
  const { 
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors } 
    } = useForm<{ password: string, file: FileList }>()

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      
        <DialogHeader>
          <DialogTitle>Upload CSV file</DialogTitle>
          <DialogDescription>Choose a .csv file to upload <span className="block text-red-500">Dont forget to copy and save the default password</span></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="grid grid-cols-4 gap-2 items-center">
            <p className="text-xs text-right">Default Password</p>
            <div className="col-span-3 flex gap-2">
              <Input {...register('password', { required : true, minLength: 8})} className={`${errors.password ? 'border-red-400' : '' }`}/>
              <Button size='sm' type='button' disabled={isSubmitting} onClick={() => {
                const key = nanoid(10)
                setValue('password', key)
              }}>
                <KeyRound size={16} />
              </Button>
            </div>
            <p className="text-right"></p>
            <div className="col-span-3 flex gap-2">
              <Input type="file" className={`${errors.file ? 'border-red-400' : '' }`} accept=".csv" {...register('file', { required: true })}/>
              <Button size='sm' type='submit' disabled={isSubmitting}>
                <FileCog size={16} />
              </Button>
            </div>
          </div>
        </form>

    </Modal>
  )
}
