import React from "react";
import { StudentTable } from "./table/data-table";
import { columns } from "./table/columns";

const page = () => {
  return <StudentTable columns={columns} />;
};

export default page;
