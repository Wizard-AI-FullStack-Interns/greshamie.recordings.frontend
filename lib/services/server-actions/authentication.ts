"use server";

import { AxiosResponse } from "axios";
import { flattenValidationErrors } from "next-safe-action";
import { GreshamAxiosConfig } from "@/lib/config/main-backend-axios-config";
import { loginEndpoint, logoutEndpoint, reauthenticateEndpoint } from "@/api/endpoints/auth-endpoints";
import { LoginSchema } from "@/lib/schema/authentication-schema";
import { actionClient } from "@/lib/config/safe-action";
import { deleteAuthCookie, getAccessToken, getRefreshToken, setAuthCookie } from "./cookie";
import { handleUseServerResponse } from "@/lib/handlers/api-response-handlers/handle-use-server-response";
import { IUserWithToken } from "@/lib/interfaces/user-interfaces";
import { parseISO } from 'date-fns';

// TODO: Implement zsa
/**
 * Handles login action.
 *
 * @remarks
 * This action is used to handle login request from the client.
 * It uses the {@link loginUserUseCase} use case to perform the business logic for logging in.
 *
 * @param {LoginInput} input - The login input.
 * @returns {Promise<LoginOutput>} - The login output.
 */
export const loginUserAction = actionClient
    .schema(LoginSchema, {
        handleValidationErrorsShape: async (ve) =>
            flattenValidationErrors(ve).fieldErrors,
    })
    .action(
        async ({ parsedInput: { username, password } }) => {
            const request = async (): Promise<AxiosResponse<IUserWithToken>> => {
                let requestBody = { username, password };

                return GreshamAxiosConfig.post<IUserWithToken>(loginEndpoint, requestBody);
            };

            // Handle the response
            const response = await handleUseServerResponse({
                request,
                successMessage: "Logged in successfully! 🎉",
            });

            if (response?.data?.accessToken) {
                const isSetSuccessfully = await setAuthCookie(response?.data);
                if (!isSetSuccessfully) {
                    throw new Error("Failed to set auth cookie");
                }
            }
            return response;
        }
    );

export const logoutUserAction = actionClient.action(async (): Promise<boolean> => {
    const response = await GreshamAxiosConfig.post(logoutEndpoint);
    if (response.status === 200) {
        await deleteAuthCookie();
        return true
    }

    return false;

});

export const reauthenticate = async (): Promise<boolean> => {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken?.value) {
            return false;
        }

        const response = await GreshamAxiosConfig.post(reauthenticateEndpoint,
            { RefreshToken: refreshToken.value },  // Request body
        );


        if (response?.status !== 200) {
            return false;
        }

        const isSetSuccessfully = await setAuthCookie(response?.data);
        if (!isSetSuccessfully) {
            return false;
        }

        return true;
    }
    catch (e) {
        return false;
    }
}


export const hasValidAccessToken = async (): Promise<Boolean> => {
    const accessToken = await getAccessToken();

    if (accessToken && accessToken.expiresAt) {
        const utcDate = parseISO(accessToken.expiresAt)

        if (utcDate <= new Date()) {
            return false
        }

        // Has Valid Token
        return true;
    }

    // No Token found
    return false;
}



export const hasValidRefreshToken = async (): Promise<Boolean> => {
    const refreshToken = await getRefreshToken();

    if (refreshToken && refreshToken.expiresAt) {
        const utcDate = parseISO(refreshToken.expiresAt)

        if (utcDate <= new Date()) {
            return false
        }

        // Has Valid Token
        return true;
    }

    // No Token found
    return false;
} 
