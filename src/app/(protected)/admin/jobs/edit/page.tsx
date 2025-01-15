import { redirect } from 'next/navigation';
import React from 'react'

const page = () => {
  return redirect("/admin/jobs");
};

export default page
