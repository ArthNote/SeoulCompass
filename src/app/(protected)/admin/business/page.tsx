"use client";

import React from "react";
import { BusinessTable } from "./table/data-table";
import { columns } from "./table/columns";

const BusinessPage = () => {
  return <BusinessTable columns={columns} />;
};

export default BusinessPage;
