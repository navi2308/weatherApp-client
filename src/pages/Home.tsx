import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAtom, useSetAtom } from "jotai";
import { Location, locationAtom } from "../lib/atoms";
import { TIME_IN_MS } from "../lib/utils";
import { useSession } from "../hooks/useSession";
import { useState } from "react";

const LocationSearch = () => {
  const [location, setLocation] = useState("");

  const setLocationAtom = useSetAtom(locationAtom);

  const { refetch } = useQuery({
    queryKey: [`location`, location],
    queryFn: async () => {
      const res = await fetch(`/api/weather/${location}`);

      const data = (await res.json()) as Location;
      setLocationAtom(data);

      return data;
    },
    staleTime: TIME_IN_MS.FIVE_MINUTES,
    enabled: false,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        refetch();
      }}
    >
      <input autoFocus value={location} onChange={(e) => setLocation(e.currentTarget.value)} />
      <button className="hidden">
        <p className="sr-only">Search for location</p>
      </button>
    </form>
  );
};

function Home() {
  const { isLoggedIn, session } = useSession();

  const [location, setLocation] = useAtom(locationAtom);

  useQuery({
    queryKey: [session, session?.preferedLocation],
    queryFn: async () => {
      const res = await fetch("/api/weather");

      const data = (await res.json()) as Location;
      setLocation(data);
      return data;
    },
    enabled: isLoggedIn,
    staleTime: TIME_IN_MS.FIVE_MINUTES,
  });

  return (
    <div className="flex flex-col gap-2 items-center">
      <LocationSearch />
      {location && (
        <div className="flex flex-col text-center">
          <span>Temp: {location.forcast.currentTemp}º C</span>

          <span>Status: {location.forcast.currentStatus}</span>
          <span>Location: {location.data.name}</span>
          {session?.preferedLocation === null && (
            <Link to={"/set-location"}>Hey your location is null - please set it</Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
