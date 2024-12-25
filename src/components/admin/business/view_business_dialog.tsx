import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Business } from "@/app/(protected)/(admin)/business/table/columns";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Globe,
  ScrollText,
} from "lucide-react";

interface ViewBusinessDialogProps {
  business: Business;
}

const ViewBusinessDialog = ({ business }: ViewBusinessDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View Business
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-2">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {business.name}
              </DialogTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm capitalize">{business.category.replace('_', ' ')}</span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="capitalize px-3 py-1 w-fit h-fit"
            >
              {business.category}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6 pt-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>Location</span>
            </div>
            <p className="font-medium text-sm">{business.location}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScrollText className="h-4 w-4 flex-shrink-0" />
              <span>Description</span>
            </div>
            <div className="text-sm leading-relaxed prose prose-sm max-w-none max-h-[150px] overflow-y-auto rounded-md border p-4">
              {business.description}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4 flex-shrink-0" />
              <span>Website</span>
            </div>
            <p className="text-sm font-medium break-all">{business.website}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => window.open(business.website, '_blank')}
            className="w-full sm:w-auto"
          >
            <Globe className="w-4 h-4 mr-2" />
            Visit Website
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBusinessDialog;
