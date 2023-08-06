import { useEffect, useState } from "react";

const KEY = "971de975";

//this is a custom hook!
// export function useMovies(query, callback) {
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      //converting to promises to an async function
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=?${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("something went wrong with fetching movies"); // this is to get error in case fexample error connection.

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
          // console.log(data);
          console.log(data.Search);
        } catch (err) {
          console.log(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      //   callback?.(); //it will be call if it exists.
      fetchMovies();

      // Between each of these re-renders, this function here (the cleanup function) will get called. It means that each time there is a new keystroke, so a new re-render, our controlloer will abort the current fetch request. We want to cancel the current request each time that a new one comes in.
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
