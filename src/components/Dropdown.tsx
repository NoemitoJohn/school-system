import React from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'


export default function Dropdown<T >({onChange, value, items, getLabel, getValue, label } : { 
    onChange? : (...even : any[]) => void,
    value? : string ,
    items : T[],
    getLabel? : (props : T) => string  
    getValue? : (props : T) => string 
    label : string
  }){

  return (
    
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((v, i)=> {
            const label = getLabel ? getLabel(v) : v
            const val = getValue ? getValue(v) : v
            return (
              <SelectItem key={label as string} value={val as string}>{label as string}</SelectItem> 
            )
          })}
          
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}