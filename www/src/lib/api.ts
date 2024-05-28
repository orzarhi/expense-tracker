import { type ApiRoutes } from "@api/app";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

// @ts-ignore
export const api = client.api;

const getCurrentUser = async () => {
    const res = await api.me.$get();
    if (!res.ok) {
        throw new Error("Failed to fetch me");
    }
    const data = await res.json();
    return data;
}

export const userQueryOptions = queryOptions({
    queryKey: ["get-current-user"],
    queryFn: getCurrentUser,
    staleTime: Infinity

})