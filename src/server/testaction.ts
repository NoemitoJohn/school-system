// 'use server'


// import { client } from "@/database/db"
// import { revalidatePath } from "next/cache"

// export type TestType = {
//   user_name : string
// }


// export const addUser = async ( user : TestType) => {
//   const addUser = await client.execute({
//     sql : 'insert into user values(?, ?)',
//     args : [null, user.user_name]
//   })
//   revalidatePath('/student/enrollment')
// }