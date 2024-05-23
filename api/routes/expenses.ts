import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { createExpenseSchema, type Expense } from "../lib/validators/expenses";

const fakeExpenses: Expense[] = [
    { id: 1, title: 'Car Insurance', amount: 294.67 },
    { id: 2, title: 'Rent', amount: 1000 },
    { id: 3, title: 'Groceries', amount: 250.45 },

]

export const expenses = new Hono()

expenses.get('/', (c) => c.json({ expenses: fakeExpenses }))

expenses.get('/total-spent', async (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0)
    return c.json({ total })
})

expenses.post('/', zValidator("json", createExpenseSchema), (c) => {
    const expense = c.req.valid("json")
    fakeExpenses.push({ id: fakeExpenses.length + 1, ...expense })
    return c.json(fakeExpenses, 201)
})

expenses.get('/:id{[0-9]+}', (c) => {
    const id = +c.req.param("id")
    const expense = fakeExpenses.find(e => e.id === id)

    if (!expense) {
        return c.notFound()
    }

    return c.json({ expense })

})

expenses.delete('/:id{[0-9]+}', (c) => {
    const id = +c.req.param("id")
    const index = fakeExpenses.findIndex(e => e.id === id)

    if (index === -1) {
        return c.notFound()
    }

    fakeExpenses.splice(index, 1)
    return c.json(fakeExpenses)
})