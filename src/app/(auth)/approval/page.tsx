import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function ApprovalPage() {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <Card className='w-[400px]  rounded-none'>
        <CardHeader>
          <CardTitle>Pending Approval</CardTitle>
          <CardDescription>Thank you for your submission. Your request is currently under review and will be approved shortly. We appreciate your patience!</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
