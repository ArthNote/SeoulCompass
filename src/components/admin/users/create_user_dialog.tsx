import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type WrapperProps = {
  children: ReactNode; // Allows any React component or JSX as a child
};

const CreateUserDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="ml-auto h-8 ">
          <Plus />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a User</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Pedro Duarte"
              className="col-span-3"
              type="text"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="pedro@gmail.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role">Role</Label>
            <RadioGroup defaultValue="comfortable" id="role" className="flex flex-row gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="r1" />
                <Label htmlFor="r1">User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="r2" />
                <Label htmlFor="r2">Admin</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
