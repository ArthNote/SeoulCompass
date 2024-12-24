import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type LatestAddedDataProps = {
  title: string;
  description: string;
  viewAllUrl: string;
  data: {
    name: string;
    email: string;
    date: string;
    pic: string;
  }[];
  headers: string[];
};

export default function LatestAddedData({
  latestData,
}: {
  latestData: LatestAddedDataProps;
}) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{latestData.title}</CardTitle>
          <CardDescription className="text-balance">
            {latestData.description}
          </CardDescription>
        </div>
        <Button
          size="sm"
          className="shrink-0 gap-1 px-4 sm:ml-auto"
        >
          <Link
            href={latestData.viewAllUrl}
            className="flex items-center gap-2"
          >
            <span>View All</span>
            <ArrowUpRight className="hidden size-4 sm:block" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {latestData.headers.map((header, index) => (
                <TableHead
                  key={index}
                  className={
                    latestData.headers.length - 1 == index ? "text-right" : ""
                  }
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {latestData.data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-4">
                  <Avatar className="size-9">
                    <AvatarImage src={row.pic} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-medium">{row.name}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {row.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
