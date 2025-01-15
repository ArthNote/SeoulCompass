"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  placeholder?: string;
  value?: string[];
  onChange?: (tags: string[]) => void;
  suggestions?: string[];
  className?: string;
}

export function TagInput({
  placeholder = "Type and press enter...",
  value = [],
  onChange,
  suggestions = [],
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [tags, setTags] = React.useState<string[]>(value);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  // Sync internal state with external value
  React.useEffect(() => {
    setTags(value || []);
  }, [value]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange?.(newTags);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  const filteredSuggestions = suggestions.filter(
    (s) => 
      s.toLowerCase().includes(inputValue.toLowerCase()) && 
      !tags.includes(s)
  );

  return (
    <div className="w-full space-y-2 relative">
      <div className="flex flex-wrap gap-2 rounded-md border p-2 min-h-[2.5rem]">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="h-7">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue) {
              e.preventDefault();
              addTag(inputValue);
            } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
              removeTag(tags.length - 1);
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder : undefined}
          className="flex-1 !border-0 !ring-0 !ring-offset-0 focus-visible:!ring-0 px-0 py-0.5 h-7 min-w-[100px]"
        />
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 left-0 right-0 max-h-40 overflow-auto rounded-md border bg-popover shadow-md">
          <div className="p-1">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
