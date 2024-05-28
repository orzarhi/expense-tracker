import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import logo from "../assets/images/logo.webp";

const Login = () => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <img src={logo} alt="logo" width={80} height={10} className="" />
      <h3 className="text-lg font-semibold">You have to login or register</h3>
      <div className="flex flex-col gap-y-4">
        <Button asChild className="w-44">
          <a href="/api/login">Login</a>
        </Button>
        <Button asChild className="w-44">
          <a href="/api/register">Register</a>
        </Button>
      </div>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  if (!user) {
    return <Login />;
  }

  return <Outlet />;
};

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      return data;
    } catch (e) {
      return { user: null };
    }
  },
  component: Component,
});