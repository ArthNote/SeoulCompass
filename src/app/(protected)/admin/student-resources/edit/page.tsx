import { redirect } from 'next/navigation';
import React from 'react'

const page = () => {
  return redirect("/admin/student-resources");
};

export default page
