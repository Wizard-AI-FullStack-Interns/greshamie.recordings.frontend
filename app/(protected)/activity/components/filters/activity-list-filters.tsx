import { MultiToggleGroupFilter } from "@/components/filters/multi-toggle-group-filter";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { IActivityFilters, TEventType } from "@/lib/interfaces/activity-interface";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateUrlParams } from "@/hooks/browser-url-params/use-update-url-params";
import { ActivityListAdvanceFilters } from "./activity-list-advance-filters";
import { SingleToggleGroupFilter } from "@/components/filters/single-toggle-group-filter";
import { EventTypes } from "@/constants/activity-types";
import { SingleChoiceDropdown } from "@/components/common/single-choice-dropdown";

interface ActivityListFiltersProps {
  retrievedFilters: IActivityFilters
  resetActivityFilters: () => void
}

export const ActivityListFilters = ({ 
  retrievedFilters, 
  resetActivityFilters 
}: ActivityListFiltersProps) => {
  const { updateUrlParams } = useUpdateUrlParams();
  // 01 Activity Types

  // Handle changes in SINGLE call type selection.
  const handleSelectActivityType = (value: TEventType) => {
    updateUrlParams({ eventType: value });
  };

  // 2. Search
  const [search, setSearch] = useState<IActivityFilters['search']>("");
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    updateUrlParams({ search: debouncedSearch })
}, [debouncedSearch, updateUrlParams]);

  return (
    <div className="flex gap-4">
        <SingleToggleGroupFilter
            value={retrievedFilters?.eventType}
            onValueChange={handleSelectActivityType}
            options={EventTypes}
            className="hidden lg:block"
        />

        <SingleChoiceDropdown
                value={retrievedFilters?.eventType}
                onValueChange={handleSelectActivityType}
                options={EventTypes}
                className="block lg:hidden"
        />

        <ActivityListAdvanceFilters 
          retrievedActivityFilters={retrievedFilters} resetActivityFilters={resetActivityFilters} 
        />
        <div className="relative w-full">
          <Input className="pr-9" placeholder="Search phone number or participants..." onChangeCapture={(e) => setSearch(e.currentTarget.value)} />
          <Search className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
        </div>
    </div>
  );
};
