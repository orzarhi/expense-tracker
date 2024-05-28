import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute, authRoute } from "./routes";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api")
    .route("/expenses", expensesRoute)
    .route("/", authRoute);

app.get("*", serveStatic({ root: "./www/dist" }));
app.get("*", serveStatic({ path: "./www/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
