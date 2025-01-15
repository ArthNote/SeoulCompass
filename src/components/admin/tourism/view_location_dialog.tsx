import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Mail,
  Star,
  Navigation,
  ScrollText,
  Phone,
} from "lucide-react";
import { TourismType } from "@/types/tourism";

interface ViewLocationDialogProps {
  location: TourismType;
}

const ViewLocationDialog = ({ location }: ViewLocationDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View Location
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {location.name}
              </DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm capitalize">{location.type}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="capitalize px-3 py-1 w-fit h-fit"
            >
              {location.rating.toFixed(1)} <Star className="h-3 w-3 ml-1" />
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
              <p className="font-medium text-sm">{location.location.address}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4 flex-shrink-0" />
                <span>Coordinates</span>
              </div>
              <p className="font-medium text-sm">
                {location.location.latitude}, {location.location.longitude}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScrollText className="h-4 w-4 flex-shrink-0" />
              <span>Description</span>
            </div>
            <div className="text-sm leading-relaxed prose prose-sm max-w-none max-h-[150px] overflow-y-auto rounded-md border p-4">
              {location.description}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>Contact</span>
            </div>
            <p className="text-sm font-medium break-all">{location.contact.phone}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => window.open(`tel:${location.contact}`)}
            className="w-full sm:w-auto"
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Change to default export
export default ViewLocationDialog;
