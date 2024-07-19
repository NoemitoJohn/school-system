import React from 'react'
import { Table as TB, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { flexRender, Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'


export default function DataTableCustomHook<T>({table, handleRowClick, className } : {table : Table<T> , handleRowClick? : (original : T) => void, className? : string }) {
  return (
    <div className='rounded-md border'>
      <div className={cn("relative w-full overflow-auto", className)}>
        <TB>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return(
                    <TableHead key={header.id}>
                      { header.isPlaceholder ? null : 
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      }
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
          {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={row.getToggleSelectedHandler()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TB>
      </div>
    </div>
  )
}
