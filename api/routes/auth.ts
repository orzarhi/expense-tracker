import { Hono } from 'hono';
import { kindeClient, sessionManager } from '../kinde';

export const auth = new Hono();

auth.get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager);
    return c.redirect(loginUrl.toString());
});

auth.get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager);
    return c.redirect(registerUrl.toString());
});
