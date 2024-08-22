'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoginSchema, TLoginSchema } from '@/validation/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'


export default function Login() {
  
  const {handleSubmit, register, formState : {isSubmitting}} = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema)
  })

  const handleLoginSubmit : SubmitHandler<TLoginSchema> = async (formData) => {
    
    const request = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    
    if(!request.ok) { return toast.error('Something went wrong');}
    
    const response = await request.json()


    if(!response.success) { return toast.error(response.message) }

    toast.success('Yaaaaay yawa!')
  }

  return (
    <div>
      <Card className='rounded-none shadow-md'>
        <CardHeader >
          <CardTitle>Login</CardTitle>
          <CardDescription>Provide information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLoginSubmit)}>
            <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label >Email</Label>
              <Input {...register('email')} type='email' placeholder="example@gmail.com" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label >Password</Label>
              <Input {...register('password')} type='password' placeholder="Password" />
            </div>
            <div className=" flex items-center justify-between">
                <span className="text-xs">Don't have an account? <Link href='/signup'><span className="hover:text-primary underline text-foreground">Sign up</span></Link></span>
                <Button size='sm' disabled={isSubmitting}>Login</Button>
              </div>
            </div>
          </form>
        </CardContent>

      </Card>

    </div>
  )
}
