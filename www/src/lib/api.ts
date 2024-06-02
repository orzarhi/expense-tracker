import { type ApiRoutes } from "@api/app";
import { type CreateExpense } from "@api/sharedTypes";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

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
    staleTime: Infinity,
})

export const getAllExpenses = async () => {
    const res = await api.expenses.$get();
    if (!res.ok) {
        throw new Error("Failed to fetch total spent");
    }
    const data = await res.json();
    return data;
}

export const getAllExpensesQueryOptions = queryOptions({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
    staleTime: 1000 * 60 * 5, // 5 minutes
})

export const createExpense = async ({ value }: { value: CreateExpense }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const res = await api.expenses.$post({ json: value })

    if (!res.ok) {
        throw new Error('Failed to create expense')
    }
    const newExpense = await res.json()

    return newExpense
}

export const loadingCreateExpenseQueryOptions = queryOptions<{ expense?: CreateExpense }>({
    queryKey: ['loading-create-expense'],
    queryFn: async () => {
        return {};
    },
    staleTime: Infinity,
})