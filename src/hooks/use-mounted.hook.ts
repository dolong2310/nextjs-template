// import { useEffect, useState } from "react";

// function useMounted() {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setIsMounted(true);
//   }, []);

//   return isMounted;
// }

import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {}, // không cần subscribe
    () => true, // client snapshot
    () => false, // server snapshot
  );
}

export default useMounted;
