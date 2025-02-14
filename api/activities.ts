import { GreshamAxiosConfig } from "@/lib/config/main-backend-axios-config";
import { activityEndpoint } from "./endpoints/activity-endpoints";
import { IActivityFilters, IActivityResponse } from "@/lib/interfaces/activity-interface";
import { AxiosResponse } from "axios";

 export const fetchActivity = async (filters?: IActivityFilters): Promise<AxiosResponse<IActivityResponse>> => {
      let finalEndpoint = activityEndpoint;
    
        if (filters) {
            const queryParams = Object.entries(filters)
                .filter(([key, value]) => {
                    // Check if the value is a non-empty array, or if it's a non-falsy string or number
                    return value && (Array.isArray(value) ? value.length > 0 : true);
                })
                .map(([key, value]) => {
                    // If the value is a Date, convert it to an ISO string
                    if (value instanceof Date) {
                        value = value.toISOString();
                    }
                    return `${key}=${value}`;
                })
                .join('&'); // Join the query parameters with '&'
    
            if (queryParams) {
                // If there are existing params in the endpoint, append with '&', else use '?'
                finalEndpoint = activityEndpoint.includes('?')
                    ? `${activityEndpoint}&${queryParams}`
                    : `${activityEndpoint}?${queryParams}`;
            }
        }
    
        return await GreshamAxiosConfig.get(finalEndpoint);
}