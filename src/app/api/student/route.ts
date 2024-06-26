export async function POST(request: Request) {

  const res = await request.json()
  console.log(res)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Response.json({status : 200})
}