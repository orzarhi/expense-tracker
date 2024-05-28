import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { createExpenseSchema, type Expense } from "../lib/validators/expenses";
import { getUser } from '../kinde'
import { db } from "../db";
import { expenses as expensesTable } from "../db/schema/expenses";
import { eq } from "drizzle-orm";

const fakeExpenses: Expense[] = [
    { id: 1, title: 'Car Insurance', amount: '294.67' },
    { id: 2, title: 'Rent', amount: '1000' },
    { id: 3, title: 'Groceries', amount: '250.45' },

]

export const expensesRoute = new Hono()

expensesRoute.get('/', getUser, async (c) => {
    const user = c.var.user
    const expenses = await db.select().from(expensesTable).where(eq(expensesTable.userId, user.id))

    return c.json({ expenses })
})

expensesRoute.get('/total-spent', getUser, async (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + +e.amount, 0)
    return c.json({ total })
})

expensesRoute.post('/', getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = c.req.valid("json")
    const user = c.var.user

    const result = await db.insert(expensesTable).values({
        ...expense,
        userId: user.id
    }).returning

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