import { Button } from '@/components/ui/button'
import { Calendar } from "@/components/ui/calendar"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createExpense, getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from '@/lib/api'
import { createExpenseSchema } from '@api/sharedTypes'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { format } from 'date-fns'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: '',
      amount: '',
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(getAllExpensesQueryOptions)

      navigate({ to: '/expenses' })

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, { expense: value })

      try {
        const newExpense = await createExpense({ value })

        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, ({
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses],
        }))
        toast.success("Expense Created", {
          description: `Successfully created expense: ${newExpense.id}`
        })
      } catch (error) {
        toast.error("Failed to create expense")
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {})

      }
    },
  })

  return (
    <div className="p-2 space-y-5">
      <h3 className='text-2xl font-semibold'>Create Expense 😣</h3>
      <form
        className='flex flex-col gap-y-2'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <em className='text-sm font-semibold text-red-500'>{field.state.meta.touchedErrors}</em>
              ) : null}
            </>
          )}
        />

        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <>
              <Label htmlFor={field.name} className='mt-2'>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type='number'
                inputMode='numeric'
                min={1}
                placeholder='₪199'
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <em className='text-sm font-semibold text-red-500'>{field.state.meta.touchedErrors}</em>
              ) : null}
            </>
          )}
        />
        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => (
            <div className='self-center'>
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) => {
                  const selectedDate = date ?? new Date();
                  const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                  field.handleChange(formattedDate);
                }}
                className=""
              />
              {field.state.meta.touchedErrors ? (
                <em className='text-sm font-semibold text-red-500'>{field.state.meta.touchedErrors}</em>
              ) : null}
            </div>
          )}
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" className='w-full mt-4 sm:w-36' disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}