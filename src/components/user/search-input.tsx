"use client";

import React from "react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchInput = React.memo(
  ({ value, onChange, className }: SearchInputProps) => (
    <Input
      type="text"
      placeholder="Search locations..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  )
);

SearchInput.displayName = "SearchInput";
