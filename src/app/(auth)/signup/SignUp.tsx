'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpSchema, TSignUpSchema } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import { useRouter } from 'next/navigation'
async function signUpFecther(url : string, {arg} : {arg : { body : TSignUpSchema}}) {
  
}

export default function SignUp() {
  const router = useRouter()
  const {trigger} = useSWRMutation('/api/auth/', signUpFecther)

  const {register, handleSubmit, formState : {isSubmitting}} = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema)
  })

  const handleSignUpSubmit : SubmitHandler<TSignUpSchema> = async (formData) => {
    const request =  await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    if(!request.ok) { return toast.error('Something went wrong') } 
    router.push('/dashboard')
  }

  return (
    <div>
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>SignUp</CardTitle>
          <CardDescription>Provide information below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignUpSubmit)}>
            <div className="grid w-full grid-cols-2  items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label >First Name</Label>
                <Input {...register('first_name')} id="name" placeholder="First Name" />
              </div>
              <div className="flex flex-col  space-y-1.5">
                <Label >Email</Label>
                <Input {...register('email')} id="name" type="email" placeholder="Email" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label >Last Name</Label>
                <Input {...register('last_name')} id="name" placeholder="Last Name" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label >Password</Label>
                <Input {...register('password')} id="name" type="password" placeholder="Password" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label >Phone Number</Label>
                <Input {...register('phone_number')} id="name" placeholder="Phone Number" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label >Confirm Password</Label>
                <Input {...register('confirm')} id="name" type="password" placeholder="Confirm Password" />
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <span className="text-sm">Already have an account? <Link href='/login'><span className="hover:text-primary underline text-foreground">Login</span></Link></span>
                <Button size='sm' disabled={isSubmitting}>Sign Up</Button>
              </div>
            </div>
          </form>
        </CardContent>

      </Card>

    </div>
  )
}
