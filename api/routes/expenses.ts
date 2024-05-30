import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { createExpenseSchema } from "../sharedTypes";
import { getUser } from '../kinde'
import { db } from "../db";
import { expenses as expensesTable, insertExpensesSchema, selectExpensesSchema } from "../db/schema/expenses";
import { desc, eq, sum, and } from "drizzle-orm";

export const expensesRoute = new Hono()

expensesRoute.get('/', getUser, async (c) => {
    const user = c.var.user
    const expenses = await db.select()
        .from(expensesTable)
        .where(eq(expensesTable.userId, user.id))
        .orderBy(desc(expensesTable.createdAt))
        .limit(100)

    return c.json({ expenses })
})

expensesRoute.get('/total-spent', getUser, async (c) => {
    const user = c.var.user

    const result = await db.select({ total: sum(expensesTable.amount) })
        .from(expensesTable)
        .where(eq(expensesTable.userId, user.id))
        .limit(1)
        .then((res) => res[0].total)

    return c.json(result)
})

expensesRoute.post('/', getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = c.req.valid("json")
    const user = c.var.user

    const validatedExpense = insertExpensesSchema.parse({
        ...expense,
        userId: user.id
    })

    const result = db
        .insert(expensesTable)
        .values(validatedExpense)
        .returning().then((res) => res[0]);

    return c.json(result, 201)
})

expensesRoute.get('/:id{[0-9]+}', getUser, async (c) => {
    const id = +c.req.param("id")
    const user = c.var.user

    const expense = await db.select()
        .from(expensesTable)
        .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
        .then((res) => res[0])

    if (!expense) {
        return c.notFound()
    }

    return c.json({ expense })

})

expensesRoute.delete('/:id{[0-9]+}', getUser, async (c) => {
    const id = +c.req.param("id")
    const user = c.var.user

    const expense = await db.delete(expensesTable)
        .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
        .returning()
        .then((res) => res[0])

    if (!expense) {
        return c.notFound()
    }

    return c.json({ expense })
})