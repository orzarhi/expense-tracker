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
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { format } from 'date-fns';

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

const getAllExpenses = async () => {
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

  console.log("🚀 ~ Expenses ~ data:", data)
  return (
    <Table>
      <TableCaption>A list of your expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>CratedAt</TableHead>

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
          : data?.expenses.map((expense: any) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{formatPrice(expense.amount)}</TableCell>
              <TableCell>{format(expense.createAt, 'dd/MM/yy HH:mm:ss')}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}




