import { userQueryOptions } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useQuery, type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from "@/components/ui/sonner"
import { Home, ScrollText, SquarePlus, User } from 'lucide-react'

interface MyRouterContext {
  queryClient: QueryClient
}
export const Route = createRootRouteWithContext<MyRouterContext>()(({
  component: Root,
}))

function NavBar() {
  const { data } = useQuery(userQueryOptions)

  return (
    <div className="flex gap-2 p-2 ml-2 space-x-4 justify-evenly">
      <Link to="/" className={cn("flex gap-2 [&.active]:font-bold", {
        'text-zinc-600': !data,
      })} disabled={!data}>
        <Home className='hidden my-auto size-4 sm:block' /> Home
      </Link> |
      {/* <Link to="/about" className="[&.active]:font-bold">
        About
      </Link> | */}
      <Link to="/expenses" className={cn("flex gap-2 [&.active]:font-bold", {
        'text-zinc-600': !data,
      })} disabled={!data}>
        <ScrollText className='hidden my-auto size-4 sm:block' /> Expenses
      </Link> |
      <Link to="/create-expense" className={cn("flex gap-2 [&.active]:font-bold", {
        'text-zinc-600': !data,
      })} disabled={!data}>
        <SquarePlus className='hidden my-auto size-4 sm:block' /> Create
      </Link> |
      <Link to="/profile" className={cn("flex gap-2 [&.active]:font-bold", {
        'text-zinc-600': !data,
      })} disabled={!data}>
        <User className='hidden my-auto size-4 sm:block' /> Profile
      </Link>
    </div>
  )
}

function Root() {
  return (
    <>
      <NavBar />
      <hr />
      <main className='max-w-3xl m-auto mt-7'>
        <Outlet />
      </main>
      <Toaster />
      {/* <TanStackRouterDevtools /> */}
    </>
  )
}