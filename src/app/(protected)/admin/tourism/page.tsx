import React from 'react'
import { TourismTable } from './table/data-table'
import { columns } from "./table/columns";

const page = () => {
  return (
    <TourismTable columns={columns} />
  )
}

export default page
