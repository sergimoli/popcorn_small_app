import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "971de975";

// estructural component
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  //remember we can use the handleclosemovie function before it is actually defined because remember function decalrations in javascript like this are hoisted.
  // REMEMBER: The function expressions and arrow functions cannot be hoisted. On the other hand, all the variables in javascript are hoisted. So, in these cases, better use function declarations.
  // const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const { movies, isLoading, error } = useMovies(query);

  // const [watched, setWatched] = useState([]);
  //React will call this function here on the inital render and we will use whatever value is returned from this function as the initial value of the state. And this function actually needs to be a pure function and cannot receive any arguments. Passing arguments will not work. Thhis function is only executed oce on the inital render and ingore on subsequent re-renders.

  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue); // the local storage is a string with JSON.stringigy and then when we get the data back we need to convert it back by doing JSON.parse.
  });

  function handleSelectMovie(id) {
    //setSelectedId(id); doing this we only select the id, but.. if we click again we desselect(closes), look at it!
    //if the id == current one set the new sselected ID to NULL
    setSelectedId((currentid) => (id === currentid ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((currwatchedmovies) => [...currwatchedmovies, movie]); //we get the current watched movies array and then we create a brand-new one based on that one...

    // localStorage.setItem("watched", JSON.stringify([...watched, movie])); // we need to build a new arrray based on the watched, so the current state plus the new movie (the same done before). And then we need to convert into a string because in localstorage we can only store key value pairs where the value is a string. I comment out because the idea is to it using a new effect
  }

  function handleDeleteWatched(id) {
    setWatched(
      (currWatchedMovies) =>
        currWatchedMovies.filter((movie) => movie.imdbID !== id) //if it's the same, then that movie will be filtered out (will be deleted)
    );
  }

  useEffect(() => {
    //it's fantastic becuase it works well for both: add and delete from localstorage!
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* this is passed as an explicit prop called element instead using the children */}
        {/* We say: we have an element prop and we place whatever we want to pass in right here(into element prop) */}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

// estructural component
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

// presentational component (does not have any state - it's stateless. simply presents some content)
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
//statefull component
function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(() => {
    //we need to useefect in order to use a ref that contains a DOM element like this one becuase the ref only gets added to this DOM element here after the DOM has already loaded. And sso therefore we can only access it in effect wich also runs after the DOM has been loaded. This is the perfect place for using a ref that contains a DOM element.

    function callback(e) {
      //we use a callback because we could clean up after our event.
      if (e.code === "Enter") {
        if (document.activeElement === inputEl.current) return; //don't do anything

        console.log(inputEl.current);
        inputEl.current.focus();
        setQuery("");
      }
    }

    document.addEventListener("keydown", callback);
    return () => document.addEventListener("keydown", callback);
  }, [setQuery]);

  // useEffect(() => {
  //   const el = document.querySelector(".search");
  //   console.log(el);
  //   el.focus();
  // }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
//presentational component
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

// estructural component
function Main({ children }) {
  return <main className="main">{children}</main>;
}
// stateful component
function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

// stateful component
// function Box({ element }) {
//   const [isOpen1, setIsOpen1] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {isOpen1 && element}
//     </div>
//   );
// }

// stateful component
function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}
//stateless or presentational component
function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0); //varialbe that is persisted across renders without triggering a re-render. In this case we store the amount of clicks that happended on the rating before the movie is added but we don't want to render that information on the user interface.or in other owrds, we do not want to create a re-render. that's why a ref is perfect for this.

  //we use the useEffect because we are not allowed to mutate the ref in render logic.
  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  // let's do some destructure:
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  console.log(title, year);

  // const isWatched = watched.map((movie) => movie.imdbID === selectedId); //malament!!!
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  console.log("isWatched" + isWatched);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating; //we use optional chaining. there might be no movie already in the list

  //NEVER TO THAT!!!! the hooks are ordered by position, not by name.
  //another thing to remember: the initial state value is only been looked at by React in the very beginning (only on component mount)
  // if(imdbRating > 8) [isTop, setIsTop] = useState(true)

  // const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovied = {
      imdbID: selectedId,
      imdbRating: Number(imdbRating),
      title,
      year,
      poster,
      runtime: Number(runtime.split("").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovied);
    onCloseMovie();

    //this is a simple reminder that usestate is aysncronous. when doing the avgrating + userating / 2 avgrating remains as 0... to solve need a callback!!!
    // setAvgRating(Number(imdbRating));
    // setAvgRating((avgRating + userRating) / 2);
    // //SOLUTION! the callback!!!! remmeber,
    // setAvgRating((currAvgRating) => (currAvgRating + userRating) / 2);

    // alert(avgRating);
  }
  //we add an event listerner to listen key key ESCAPE to exit from the movie selected
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
          console.log("CLOSING");
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback); //the eventlistener must be removed, because if not it creates again and again many event listeners.
      };
    },
    [onCloseMovie]
  );

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      console.log(data);
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    //the following will run AFTER THE COMPONENT HAS ALREADY UNMOUNTED!
    return function () {
      document.title = "usePopCorn";
      console.log(`clean up effect for movie ${title}`);
    };
  }, [title]); //this useefect just to change the tiltle in the tab

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button className="btn-back" onClick={onCloseMovie}>
            &larr;
          </button>
          <header>
            <img src={poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐{imdbRating} IMDb rating</span>
              </p>
            </div>
          </header>
          {/* <p>{avgRating}</p> */}
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button onClick={() => handleAdd()} className="btn-add">
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

//presentational component
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
//presentational component
function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
//presentational component
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
