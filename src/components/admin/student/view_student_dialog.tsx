import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Student } from "@/app/(protected)/(admin)/student/table/columns";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Navigation,
  ScrollText,
  Phone,
  GraduationCap,
} from "lucide-react";

interface ViewStudentDialogProps {
  resource: Student;
}

const ViewStudentDialog = ({ resource }: ViewStudentDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View Resource
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {resource.name}
              </DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm capitalize">
                  {resource.category.replace("_", " ")}
                </span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="capitalize px-3 py-1 w-fit h-fit"
            >
              {resource.category.replace("_", " ")}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6 pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Address</span>
              </div>
              <p className="font-medium text-sm">{resource.location}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4 flex-shrink-0" />
                <span>Coordinates</span>
              </div>
              <p className="font-medium text-sm">
                {resource.lat}, {resource.lng}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScrollText className="h-4 w-4 flex-shrink-0" />
              <span>Description</span>
            </div>
            <div className="text-sm leading-relaxed prose prose-sm max-w-none max-h-[150px] overflow-y-auto rounded-md border p-4">
              {resource.description}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>Contact</span>
            </div>
            <p className="text-sm font-medium break-all">{resource.contact}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => window.open(`tel:${resource.contact}`)}
            className="w-full sm:w-auto"
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact Resource
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentDialog;
