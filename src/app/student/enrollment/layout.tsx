
// export const dynamic = "force-dynamic";


export default function Layout({
  children,
}: {
  modal: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}