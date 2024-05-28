import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { createExpenseSchema, type Expense } from "../lib/validators/expenses";
import { getUser } from '../kinde'
import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { desc, eq, sum, } from "drizzle-orm";

const fakeExpenses: Expense[] = [
    { id: 1, title: 'Car Insurance', amount: '294.67' },
    { id: 2, title: 'Rent', amount: '1000' },
    { id: 3, title: 'Groceries', amount: '250.45' },

]

export const expensesRoute = new Hono()

expensesRoute.get('/', getUser, async (c) => {
    const user = c.var.user
    const expenses = await db.select()
        .from(expensesTable)
        .where(eq(expensesTable.userId, user.id))
        .orderBy(desc(expensesTable.createAt))
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

    const result = db.insert(expensesTable).values({
        ...expense,
        userId: user.id
    }).returning().then((res) => res[0])

    return c.json({ result }, 201)
})

expensesRoute.get('/:id{[0-9]+}', getUser, (c) => {
    const id = +c.req.param("id")
    const expense = fakeExpenses.find(e => e.id === id)

    if (!expense) {
        return c.notFound()
    }

    return c.json({ expense })

})

expensesRoute.delete('/:id{[0-9]+}', getUser, (c) => {
    const id = +c.req.param("id")
    const index = fakeExpenses.findIndex(e => e.id === id)

    if (index === -1) {
        return c.notFound()
    }

    fakeExpenses.splice(index, 1)
    return c.json(fakeExpenses)
})