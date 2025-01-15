"use client";

import React from 'react'
import { JobsTable } from './table/data-table'
import { columns } from './table/columns'

const JobsPage = () => {
  return <JobsTable columns={columns} />;
}

export default JobsPage
