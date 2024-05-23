import { type ApiRoutes } from "@api/app";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

// @ts-ignore
export const api = client.api;