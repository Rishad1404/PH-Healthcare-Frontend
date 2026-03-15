/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "@/types/api.types";
import axios from "axios";
import { isTokenExpiringSoon } from "../tokenUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

async function tryRefreshToken(accessToken: string, refreshToken: string): Promise<void> {
  if (!isTokenExpiringSoon(accessToken)) {
    return;
  }

  try {
    // tryRefreshToken is server-only because it depends on next/headers/cookies
    // and internal auth services. If this function is called on the client it
    // should be a no-op.
    const headersMod = await import("next/headers");
    const requestHeader = await headersMod.headers();

    if (requestHeader.get("x-token-refresh") === "1") {
      return;
    }

    const authServices = await import("@/services/auth.services");
    await authServices.getNewTokensWithRefreshToken(refreshToken);
  } catch (error: any) {
    console.log("Error refreshing token", error);
  }
}

/**
 * Create an axios instance appropriate to the runtime.
 * - On the server we need to read cookies() and inject Cookie header so
 *   the backend receives authentication.
 * - On the client (browser) we rely on the browser to send auth cookies and
 *   set withCredentials: true so cross-site cookies are included when needed.
 */
const axiosInstance = async () => {
  // If window is undefined => server-side
  if (typeof window === "undefined") {
    // server
  const headersMod = await import("next/headers");
  const cookieStore = await headersMod.cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken && refreshToken) {
      await tryRefreshToken(accessToken, refreshToken);
    }

    const cookieHeader = cookieStore
      .getAll()
      .map((cookie: any) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    return instance;
  }

  // client (browser)
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    // allow browser to include cookies for auth (if API is same-site or CORS allows)
    withCredentials: true,
  });

  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance =await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.log(`GET request to ${endpoint} error`, error);
    throw error;
  }
};

const httpPost = async <TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`POST request to ${endpoint} error`, error);
    throw error;
  }
};

const httpPut = async <TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${endpoint} error`, error);
    throw error;
  }
};

const httpPatch = async <TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PATCH request to ${endpoint} error`, error);
    throw error;
  }
};

const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${endpoint} error`, error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};
