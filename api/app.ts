import { Hono } from "hono";
import { logger } from "hono/logger";
import { expenses } from "./routes/expenses";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/expenses", expenses);

app.get("*", serveStatic({ root: "./www/dist" }));
app.get("*", serveStatic({ path: "./www/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
