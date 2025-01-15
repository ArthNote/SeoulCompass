"use client";

import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface DebouncedSearchProps {
  onSearch: (value: string) => void;
  value: string;
  className?: string;
}

export function DebouncedSearch({ onSearch, value: externalValue, className }: DebouncedSearchProps) {
  const [value, setValue] = useState(externalValue);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  useEffect(() => {
    setValue(externalValue);
  }, [externalValue]);

  return (
    <Input
      placeholder="Search locations..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={className}
    />
  );
}
