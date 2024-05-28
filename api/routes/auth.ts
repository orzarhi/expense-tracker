import { Hono } from 'hono';
import { kindeClient, sessionManager } from '../kinde';

export const auth = new Hono();

auth.get("/login", async (c) => {
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
});

auth.get("/register", async (c) => {
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
});

// get called every time we login or register
auth.get("/callback", async (c) => {
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/");
});

auth.get("/logout", async (c) => {
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
});

auth.get("/me", async (c) => {
    const isAuthenticated = await kindeClient.isAuthenticated(sessionManager(c)); // Boolean: true or false
    return c.json({ isAuthenticated })
    if (isAuthenticated) {
        // Need to implement, e.g: call an api, etc...
    } else {
        // Need to implement, e.g: redirect user to sign in, etc..
    }
});