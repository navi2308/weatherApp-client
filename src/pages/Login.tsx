import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { queryKeys } from "../lib/queryKeys";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login } = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      const data = (await res.json()) as {
        id: string;
        email: string;
        preferedLocation: string | null;
      };

      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeys.getSession);
      navigate("/");
    },
  });

  return (
    <div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          login({ email, password });
        }}
      >
        <div className="flex items-center gap-6">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
