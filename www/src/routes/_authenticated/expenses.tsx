import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { deleteExpense, getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Trash } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function Expenses() {
  const { data, error, isPending } = useQuery(getAllExpensesQueryOptions)
  const { data: loadingCreateExpense } = useQuery(loadingCreateExpenseQueryOptions)

  if (error) return 'An error occurred: ' + error.message;

  return (
    <Table>
      <TableCaption>A list of your expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loadingCreateExpense?.expense && (
          <TableRow >
            <TableCell className="font-medium">
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell>{loadingCreateExpense?.expense.title}</TableCell>
            <TableCell>{formatPrice(loadingCreateExpense?.expense.amount)}</TableCell>
            <TableCell>{format(loadingCreateExpense?.expense.date, 'dd/MM/yy')}</TableCell>
            <TableCell>
              <Skeleton className="h-4" />
            </TableCell>
          </TableRow>
        )}
        {isPending ? Array(3).fill(0).map((_, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4" />
            </TableCell>
          </TableRow>
        ))
          : data?.expenses.map((expense: any) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{formatPrice(expense.amount)}</TableCell>
              <TableCell>{format(expense.date, 'dd/MM/yy')}</TableCell>
              <TableCell>
                <ExpenseDeleteButton id={expense.id} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

function ExpenseDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast("Error", {
        description: `Failed to delete expense: ${id}`,
      });
    },
    onSuccess: () => {
      toast("Expense Deleted", {
        description: `Successfully deleted expense: ${id}`,
      });

      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter((e) => e.id !== id),
        })
      );
    },
  });

  return (
    <Button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate({ id })}
      size='icon'
      variant='outline'
    >
      {mutation.isPending ? '...' : <Trash className="text-red-500 size-4" />}
    </Button>
  )
}