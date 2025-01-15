import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StudentResource } from "@/types/student-resource";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  resource: StudentResource;
}

const ViewStudentDialog = ({ resource }: ViewStudentDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View Details
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{resource.name}</DialogTitle>
          <DialogDescription>
            Resource Details
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-2 sm:pr-4">
          <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
            <div className="space-y-2">
              <h4 className="font-medium">Basic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-sm">
                <div className="font-medium">Type:</div>
                <div>{resource.type}</div>
                <div className="font-medium">Address:</div>
                <div>{resource.location.address}</div>
                <div className="font-medium">Rating:</div>
                <div>{resource.rating} ({resource.userRatingCount} reviews)</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Contact Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-sm">
                <div className="font-medium">Phone:</div>
                <div>{resource.contact.phone}</div>
                {resource.contact.email && (
                  <>
                    <div className="font-medium">Email:</div>
                    <div>{resource.contact.email}</div>
                  </>
                )}
                {resource.contact.website && (
                  <>
                    <div className="font-medium">Website:</div>
                    <div>{resource.contact.website}</div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Opening Hours</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-sm">
                <div className="font-medium">Weekday:</div>
                <div>{resource.openingHours.weekday}</div>
                <div className="font-medium">Weekend:</div>
                <div>{resource.openingHours.weekend}</div>
              </div>
            </div>

            {resource.accessibility && resource.accessibility.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Accessibility Features</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {resource.accessibility.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {resource.photos && resource.photos.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Photos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {resource.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${resource.name} photo ${index + 1}`}
                      className="rounded-md w-full h-48 sm:h-32 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewStudentDialog;
