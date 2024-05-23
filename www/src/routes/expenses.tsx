import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
  const res = await api.expenses.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spent");
  }
  const data = await res.json();
  return data;
}


function Expenses() {
  const { data, error, isPending } = useQuery({
    queryKey: ["get-total-expenses"],
    queryFn: getAllExpenses,
  })

  if (error) return 'An error occurred: ' + error.message;

  return (
    <div className="max-w-3xl p-2 m-auto">
      <Table>
        <TableCaption>A list of your expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
            </TableRow>
          ))
            : data?.expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.amount}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}




