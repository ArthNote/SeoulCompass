import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Job } from "@/app/(protected)/(admin)/jobs/table/columns";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building2,
  MapPin,
  Mail,
  DollarSign,
  Factory,
  ScrollText,
} from "lucide-react";

interface ViewJobDialogProps {
  job: Job;
}

const ViewJobDialog = ({ job }: ViewJobDialogProps) => {
  const formatSalary = (salary: string) => {
    const [min, max] = salary.split("-").map(Number);
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(min) +
      " - " +
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(max)
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View Job
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4  mt-2">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {job.title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{job.company}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="capitalize px-3 py-1 w-fit h-fit"
            >
              {job.industry}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6 pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 flex-shrink-0" />
                <span>Salary Range</span>
              </div>
              <p className="font-medium text-sm">{formatSalary(job.salary)}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Location</span>
              </div>
              <p className="font-medium text-sm">{job.location}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScrollText className="h-4 w-4 flex-shrink-0" />
              <span>Description</span>
            </div>
            <div className="text-sm leading-relaxed prose prose-sm max-w-none max-h-[150px] overflow-y-auto rounded-md border p-4">
              {job.description}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span>Contact</span>
            </div>
            <p className="text-sm font-medium break-all">{job.contact}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => (window.location.href = `mailto:${job.contact}`)}
            className="w-full sm:w-auto"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Employer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewJobDialog;
