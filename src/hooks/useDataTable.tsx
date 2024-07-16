import {  TableOptions, useReactTable } from '@tanstack/react-table'

export default function useDataTable<T>( props : TableOptions<T>) {
  const table = useReactTable({...props})
  return table
}


