import { z } from 'zod';

export const expensesSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string()
        .min(3, { message: 'Title must be at least 3 characters' })
        .max(100, { message: 'Title must be at most 100 characters' }),
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a number with up to 2 decimal places' }),
})

export type Expense = z.infer<typeof expensesSchema>

export const createExpenseSchema = expensesSchema.omit({ id: true })