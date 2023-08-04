import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Signup from "./pages/Signup";
import SetPrefLocation from "./pages/SetPrefLocation";
import { useSession } from "./hooks/useSession";

const queryClient = new QueryClient();

const RequireAuth = ({
  children,
  autoRedirect = true,
}: React.PropsWithChildren & {
  autoRedirect?: boolean;
}) => {
  const [status, setStatus] = useState<"authed" | "notauthed" | "loading">("loading");
  const { isLoading, isLoggedIn } = useSession();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      setStatus("loading");
      return;
    }

    if (isLoggedIn) {
      setStatus("authed");
    } else {
      if (autoRedirect) {
        navigate("/login");
      }
      setStatus("notauthed");
    }
  }, [isLoading, isLoggedIn, navigate, autoRedirect]);

  if (status === "notauthed") {
    if (!autoRedirect) {
      return (
        <div>
          Sign in to continue <Link to={"/login"}>Sign in</Link>
        </div>
      );
    }
    return null;
  }

  if (status !== "authed") return null;

  return children;
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth autoRedirect={false}>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/set-location",
        element: <SetPrefLocation />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
