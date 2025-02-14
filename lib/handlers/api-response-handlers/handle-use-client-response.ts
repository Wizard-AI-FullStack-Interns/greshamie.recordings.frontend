"use client";

import { toast } from "@/hooks/use-toast";



export interface IClientSideApiHandlerResponse {
    success?: string; // Optional success message
    error?: string | string[]; // Error can be a string or an array of strings
    isSuccessToast?: boolean;
}

export const handleApiClientSideError = (
    data: IClientSideApiHandlerResponse | undefined
) => {
    // If data is undefined, return early
    if (!data) {
        toast({
            title: "Error",
            description: "No response from the server.",
            variant: "destructive",
            duration: 5000,
        });
        return;
    }

    // If there's a success field, return early since it's not an error
    if (data.success && data.isSuccessToast) {

        toast({
            title: "Success 🎉",
            description: data?.success ?? "Your action was successful!",
            variant: "default",
            duration: 5000,
        });
        return;
    }

    // Ensure error is treated as an array
    const errorMessages = Array.isArray(data.error) ? data.error : [data.error];

    // Iterate through errors, but filter out undefined values
    errorMessages
        .filter((error): error is string => Boolean(error)) // Filter out undefined
        .forEach((error: string) => {
            toast({
                title: "Error",
                description: error || "An unknown error occurred.",
                variant: "destructive",
                duration: 5000,
            });
        });
};