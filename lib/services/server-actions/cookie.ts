"use server";
import { IAccessToken, IRefreshToken, IUserWithToken } from "@/lib/interfaces/user-interfaces";
import { add } from "date-fns"
// TODO: Secure cookie, don't expose user data and tokens on cookie [security risk]
import { cookies } from "next/headers";
import { useAuthStore } from "@/hooks/auth-store";
// import {IAuthCookie, ILoginApiResponse, ILoginOutput, IUser} from "@/lib/interfaces";

const auth = "auth";

/**
 * Retrieves the authentication cookie from the user's browser.
 *
 * @return {Promise<IUserWithToken | null>} - A Promise that resolves with the value of the authentication cookie,
 * or null if the cookie is not found.
 */
export const getParsedAuthCookie = async (): Promise<IUserWithToken | null> => {
    const cookieHeader = (await cookies()).get(auth);  // await cookies()
    return cookieHeader ? JSON.parse(cookieHeader.value) : null;
}

/**
 * Sets the authentication cookie with the provided login data.
 *
 * @param {IUserWithToken} response - The login data from the API response.
 * @return {Promise<boolean>} - A Promise that resolves when the cookie is successfully set.
 */
export const setAuthCookie = async (response: IUserWithToken): Promise<boolean> => {
    // TODO: Test the middleware make access token / refresh token expired
    // NOTE: if Both access and refresh is expired, middleware works as expected
    // if (response && response?.accessToken && response?.refreshToken) {
    //     const now = new Date();
    //     const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    //     response.accessToken.expiresAt = thirtyMinutesAgo.toISOString()
    //     response.refreshToken.expiresAt = thirtyMinutesAgo.toISOString()

    // }
    // Store cookie using `auth` key
    
    const authCookie = JSON.stringify(response);

    const cookieStore = await cookies();
    const isAuthCookieSet = await cookieStore.set(auth, authCookie, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24,
    });
    
    
    return !!isAuthCookieSet;
}

/**
 * Function to get the user object from the auth cookie.
 *
 * @return {Promise<IUser | null>} The user object from the auth cookie, or null if the cookie is not present.
 */
export const getUserFromAuthCookie = async (): Promise<IUserWithToken | null> => {
    const cookie = (await cookies()).get(auth);  // await cookies()
    if (!cookie) {
        return null;
    }
    const cookieValue = JSON.parse(cookie.value) as IUserWithToken;
    return cookieValue;
}

/**
 * Function to delete the auth cookie.
 *
 * @return {Promise<boolean>} Promise that resolves when the cookie is deleted.
 */
export const deleteAuthCookie = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("auth"); // Just delete, no further actions
};



/**
 * Function to get the Access Token from the auth cookie.
 *
 * @return {Promise<IAccessToken | undefined>}
 */
export const getAccessToken = async (): Promise<IAccessToken | undefined> => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(auth);

    const parsedCookie: IUserWithToken = cookie ? JSON.parse(cookie.value) : null;

    if (!parsedCookie || !parsedCookie?.accessToken) {
        return undefined;
    }

    return parsedCookie.accessToken
}

/**
 * Function to get the Access Token from the auth cookie.
 *
 * @return {Promise<IRefreshToken | undefined>}
 */
export const getRefreshToken = async (): Promise<IRefreshToken | undefined> => {
    const cookie = (await cookies()).get(auth);
    const parsedCookie: IUserWithToken = cookie ? JSON.parse(cookie.value) : null;

    if (!parsedCookie || !parsedCookie?.refreshToken) {
        return undefined;
    }

    return parsedCookie.refreshToken
}