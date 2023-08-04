import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const SetPrefLocation = () => {
  const [location, setLocation] = useState("");

  const {
    mutate: setPrefLocation,
    isSuccess,
    isLoading,
  } = useMutation({
    mutationFn: async (location: string) => {
      const res = await fetch("/api/auth/preference", {
        method: "POST",
        body: JSON.stringify({ preferedLocation: location }),
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      const data = (await res.json()) as {
        id: number;
        email: string;
        preferedLocation: string;
      };

      return data;
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPrefLocation(location);
        }}
      >
        <label>
          Preferred Location
          <input value={location} onChange={(e) => setLocation(e.currentTarget.value)} />
        </label>
        <button>Set preferred location</button>
      </form>
      {!isLoading && isSuccess && <div>Successfully updated preferred location</div>}
    </>
  );
};

export default SetPrefLocation;
