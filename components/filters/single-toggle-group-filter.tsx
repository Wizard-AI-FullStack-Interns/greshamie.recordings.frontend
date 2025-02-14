import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { capitalizeFirstLetter } from "@/lib/utils/format-text";
import { ReactNode, useState, useEffect } from "react";

interface SingleToggleGroupFilterProps<T extends string> {
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void; // Callback receives an array of T
  options: Record<T, string | { label: ReactNode; value: string }>;
  ariaLabelPrefix?: string;
  className?: any;
  toggleItemClass?: string;
}

export const SingleToggleGroupFilter = <T extends string>({
  value,
  onValueChange,
  options,
  ariaLabelPrefix = "Toggle filter ",
  className,
  toggleItemClass,
}: SingleToggleGroupFilterProps<T>) => {
  return (
    <ToggleGroup
    //   defaultValue={defaultValue}
      type="single"
      onValueChange={onValueChange}
      value={value}
      className={`gap-2 sm:gap-4 min-w-fit ${className}`}
    >
      {Object.keys(options).map((key: string) => {
        const option = options[key as T];
        return (
          <ToggleGroupItem
            value={key}
            aria-label={`${ariaLabelPrefix} ${key}`}
            key={key}
            className={toggleItemClass}
          >
            {typeof option === "string"
              ? capitalizeFirstLetter(option)
              : option.label}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
};
