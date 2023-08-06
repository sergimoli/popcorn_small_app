import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    // console.log(storedValue);
    return storedValue ? JSON.parse(storedValue) : initialState; // the local storage is a string with JSON.stringigy and then when we get the data back we need to convert it back by doing JSON.parse.
  });

  useEffect(() => {
    //it's fantastic becuase it works well for both: add and delete from localstorage!
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
