import { z } from 'zod';

export const expensesSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})

export type Expense = z.infer<typeof expensesSchema>

export const createExpenseSchema = expensesSchema.omit({ id: true })