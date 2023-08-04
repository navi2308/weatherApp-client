import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { useSession } from "../hooks/useSession";

const Sidebar = () => {
  const { isLoggedIn } = useSession();

  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const { mutate: logout, isLoading: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/signout", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.getSession);
    },
  });

  return (
    <aside className="px-8 shrink-0 flex flex-col items-start">
      <button onClick={() => setOpen(!open)}>
        <Menu />
      </button>
      {open && (
        <div className="flex flex-col items-start mt-2">
          {isLoggedIn ? (
            <>
              <Link to={"/"}>Home</Link>
              <Link to={"/set-location"}>Set preferred location</Link>
              <button
                className="disabled:opacity-50"
                disabled={isLoggingOut}
                onClick={() => {
                  logout();
                }}
              >
                Signout
              </button>
            </>
          ) : (
            <>
              <Link to={"/login"}>Login</Link>
              <Link to={"/signup"}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </aside>
  );
};

const Layout = () => {
  const { session } = useSession();

  return (
    <>
      <style>{`#root {width: 100%;}`}</style>
      <div className="flex items-center w-full">
        <Sidebar />
        <div className="flex flex-col w-full justify-center items-center min-h-screen gap-8">
          <div className="">{session && <div>Logged in as {session.email}</div>}</div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
