import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatPrice } from '@/lib/utils';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

const getTotalSpent = async () => {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spent");
  }
  const data = await res.json();
  return data;
}

function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ["total-spent"],
    queryFn: getTotalSpent,
  })

  return (
    <>
      <h1 className='text-3xl font-bold text-center underline'>Expense Tracker </h1>
      <Card className='m-2 text-center'>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The Total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent className='text-lg font-semibold'>{isLoading ? '...' : formatPrice(data ?? 0)}</CardContent>
      </Card>
    </>
  );
};
