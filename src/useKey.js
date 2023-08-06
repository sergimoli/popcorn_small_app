import { useEffect } from "react";

export function useKey(key, action) {
  //we add an event listerner to listen key key ESCAPE to exit from the movie selected
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
          console.log("CLOSING");
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback); //the eventlistener must be removed, because if not it creates again and again many event listeners.
      };
    },
    [action, key]
  );
}
