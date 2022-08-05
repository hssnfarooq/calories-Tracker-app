import { useEffect, useState } from "react";

export const checkLoggedIn = async () => {
  let token = localStorage.getItem("auth-token");
  console.log("helper token", token);
  if (token === null) {
    localStorage.setItem("auth-token", "");
    token = "";
    //TODO:: DISPLAY ERROR MESSAGE AND REDIRECT TO LOGIN PAGE
  }

  return token;
};

export const useSearchDebounce = (delay = 350) => {
  const [search, setSearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    const delayFn = setTimeout(() => setSearch(searchQuery), delay);
    return () => clearTimeout(delayFn);
  }, [searchQuery, delay]);

  return [search, setSearchQuery];
};
