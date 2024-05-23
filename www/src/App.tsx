import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get();
  if (!res.ok) {
    throw new Error("Failed to fetch total spent");
  }
  const data = await res.json();
  return data;
}

export const App = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["total-spent"],
    queryFn: getTotalSpent,
  })


  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The Total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{isLoading ? '...' : data?.total}</CardContent>
    </Card>
  );
};
