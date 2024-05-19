import { z } from 'zod';

export const createExpenseSchema = z.object({
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
})