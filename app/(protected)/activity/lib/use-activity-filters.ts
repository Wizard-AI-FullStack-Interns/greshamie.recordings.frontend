import { useGetUrlParams } from "@/hooks/browser-url-params/use-get-url-params";
import { useUpdateUrlParams } from "@/hooks/browser-url-params/use-update-url-params";
import {
  IActivityFilters,
  TEventType,
} from "@/lib/interfaces/activity-interface";
import { parseBoolean, parseNumber } from "@/lib/utils/parse-values";

export const useActivityFilters = () => {
  const { resetUrlParams } = useUpdateUrlParams();
  const getUrlParams = useGetUrlParams();

  const retrieveActivityFilters = (): IActivityFilters => {
    const getNumericUrlParam = (key: string): number | undefined => {
      const param = getUrlParams(key);
      return parseNumber(param);
    };

    const getBooleanUrlParam = (key: string): boolean | undefined => {
      const param = getUrlParams(key);
      return parseBoolean(param);
    };
    return {
      search: getUrlParams("search") || "",
      eventType: (getUrlParams("eventType") as TEventType) || undefined,
      startDate: getUrlParams("startDate") ?? undefined,
      endDate: getUrlParams("endDate") ?? undefined,
      // Pagination
      hasNext: getBooleanUrlParam("hasNext"),
      hasPrevious: getBooleanUrlParam("hasPrevious"),
      pageSize: getNumericUrlParam("pageSize"),
      pageOffSet: getNumericUrlParam("pageOffSet"),
      totalCount: getNumericUrlParam("totalCount"),
      totalPages: getNumericUrlParam("totalPages"),
    };
  };

  const retrievedFilters = retrieveActivityFilters();

  const resetActivityFilters = () => {
    resetUrlParams();
  };

  return { retrievedFilters, resetActivityFilters };
};
