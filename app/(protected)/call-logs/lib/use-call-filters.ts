import { useGetUrlParams } from "@/hooks/browser-url-params/use-get-url-params";
import { useUpdateUrlParams } from "@/hooks/browser-url-params/use-update-url-params";
import { ICallFilters, TCallDirections } from "@/lib/interfaces/call-interface";
import { parseBoolean, parseNumber } from "@/lib/utils/parse-values";

export const useCallFilters = () => {
  const { resetUrlParams } = useUpdateUrlParams();
  const getUrlParams = useGetUrlParams();

  const retrieveCallFilters = (): ICallFilters => {
    const getNumericUrlParam = (key: string): number | undefined => {
      const param = getUrlParams(key);
      return parseNumber(param);
    };

    const getBooleanUrlParam = (key: string): boolean | undefined => {
      const param = getUrlParams(key);
      return parseBoolean(param);
    };

    return {
      search: getUrlParams("search") || undefined,
      callDirection:
        (getUrlParams("callDirection") as TCallDirections) || undefined,
      startDate: getUrlParams("startDate") ?? undefined,
      endDate: getUrlParams("endDate") ?? undefined,
      minimumDurationSeconds: getNumericUrlParam("minimumDurationSeconds"),
      maximumDurationSeconds: getNumericUrlParam("maximumDurationSeconds"),
      hasVideoRecording: getBooleanUrlParam("hasVideoRecording"),
      hasPciCompliance: getBooleanUrlParam("hasPciCompliance"),
      hasQualityEvaluation: getBooleanUrlParam("hasQualityEvaluation"),

      // Pagination
      hasNext: getBooleanUrlParam("hasNext"),
      hasPrevious: getBooleanUrlParam("hasPrevious"),
      pageSize: getNumericUrlParam("pageSize"),
      pageOffSet: getNumericUrlParam("pageOffSet"),
      totalCount: getNumericUrlParam("totalCount"),
      totalPages: getNumericUrlParam("totalPages"),
    };
  };

  const retrievedFilters = retrieveCallFilters();

  const resetCallFilters = () => {
    resetUrlParams();
  };

  return { retrievedFilters, resetCallFilters };
};
