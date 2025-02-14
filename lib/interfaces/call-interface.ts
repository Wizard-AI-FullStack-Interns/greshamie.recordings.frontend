import { CallDirections } from "@/constants/call-types"

export type TCallDirections = typeof CallDirections[keyof typeof CallDirections]

export interface ICall {
    id: string | number,
    caller: string,
    receiver: string,
    startDateTime: Date,
    endDateTime: Date,
    callType: TCallDirections,
    isLive: boolean,
    durationSeconds: number, // Seconds
    recorder: string,
    streamingUrl: string,
    downloadUrl: string,
}

export interface ICallFilters {
    search?: string,
    callDirection?: TCallDirections,
    startDate?: string, // UTC Str
    endDate?: string, // UTC Str
    minimumDurationSeconds?: number,
    maximumDurationSeconds?: number,
    caller?: string,
    receiver?: string,
    recorder?: string,
    hasVideoRecording?: boolean,
    hasPciCompliance?: boolean,
    hasQualityEvaluation?: boolean,


    // Pagination
    hasNext?: boolean,
    hasPrevious?: boolean,
    pageSize?: number
    pageOffSet?: number
    totalCount?: number,
    totalPages?: number
}

export interface ICallLogs {
    hasNext?: boolean,
    hasPrevious?: boolean,
    items: ICall[] | [],
    pageSize?: number
    pageOffSet?: number
    totalCount?: number,
    totalPages?: number
    streamingUrl?: string,
    downloadUrl?: string,
}

export interface ICallAdvanceFilterComponent {
    startDate?: string, // UTC Str
    endDate?: string, // UTC Str
    startTime?: string, // [HH:mm (24-hour time format)]
    endTime?: string, // [HH:mm (24-hour time format)]
    minimumDurationSeconds?: number,
    maximumDurationSeconds?: number,
    hasVideoRecording?: boolean,
    hasPciCompliance?: boolean,
    hasQualityEvaluation?: boolean,
}

export type TCallFilterKeys = keyof ICallFilters;