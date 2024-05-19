import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { createExpenseSchema } from "../lib/validators/expenses";

type Expense = {
    id: string
    title: string
    amount: number
}

const fakeExpenses: Expense[] = [
    { id: '1', title: 'Car Insurance', amount: 294.67 },
    { id: '2', title: 'Rent', amount: 1000 },
    { id: '3', title: 'Groceries', amount: 250.45 },

]

export const expenses = new Hono()

expenses.get('/', (c) => c.json({ expenses: fakeExpenses }))

expenses.post('/', zValidator("json", createExpenseSchema), (c) => {
    const expense = c.req.valid("json")
    fakeExpenses.push({ id: (fakeExpenses.length + 1).toString(), ...expense })
    return c.json(fakeExpenses)
})

