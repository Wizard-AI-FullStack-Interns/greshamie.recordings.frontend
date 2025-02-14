import { Input } from "@/components/ui/input";
import { CallDirections } from "@/constants/call-types";
import { useDebounce } from "@/hooks/use-debounce";
import { ICallFilters, TCallDirections } from "@/lib/interfaces/call-interface";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useUpdateUrlParams } from "@/hooks/browser-url-params/use-update-url-params";
import { CallListAdvanceFilters } from "./advance-filter/call-list-advance-filters";
import { SingleToggleGroupFilter } from "@/components/filters/single-toggle-group-filter";
import { SingleChoiceDropdown } from "@/components/common/single-choice-dropdown";

interface CallListFiltersProps {
  retrievedFilters: ICallFilters;
  resetCallFilters: () => void;
}

export const CallListFilters = ({
  retrievedFilters,
  resetCallFilters,
}: CallListFiltersProps) => {
  const { updateUrlParams } = useUpdateUrlParams();
  // 01 Call Types
  // ---> Handle changes in call type selection.
  const handleSelectCallType = (value: TCallDirections) => {
    updateUrlParams({ callDirection: value });
  };

  // 02 Search
  const [search, setSearch] = useState<ICallFilters["search"]>("");
  // ---> Delay search update
  const debouncedSearch = useDebounce(search); // always refer to debounced value

  useEffect(() => {
    updateUrlParams({ search: debouncedSearch });
  }, [debouncedSearch, updateUrlParams]);

  // 02 Advance Filters

  return (
    <div className="flex gap-4">
      <SingleToggleGroupFilter
        value={retrievedFilters?.callDirection}
        onValueChange={handleSelectCallType}
        options={CallDirections}
        className="hidden lg:block"
      />

      <SingleChoiceDropdown
        value={retrievedFilters?.callDirection}
        onValueChange={handleSelectCallType}
        options={CallDirections}
        className="block lg:hidden"
      />

      <CallListAdvanceFilters
        retrievedCallFilters={retrievedFilters}
        resetCallFilters={resetCallFilters}
      />
      <div className="relative w-full">
        <Input
          className="pr-9"
          placeholder="Search phone number or participants..."
          onChangeCapture={(e) => setSearch(e.currentTarget.value)}
        />
        <Search className="absolute right-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};
