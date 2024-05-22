import { hc } from "hono/client";
import { type ApiRoutes } from "@api/app";

const client = hc<ApiRoutes>("/"); 

export const api = client.api;
