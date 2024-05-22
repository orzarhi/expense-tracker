import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"

export const App = () => {
  const [totalSpent, setTotalSpent] = useState<number>(0)

  const fetchTotalSpent = async () => {
    const res = await fetch('/api/expenses/total-spent')
    const data = await res.json()
    setTotalSpent(data.total)
  }

  useEffect(() => {
    fetchTotalSpent()
  }, [])



  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The Total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{totalSpent}</CardContent>
    </Card>
  )
}
