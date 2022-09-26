import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

interface State<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  startFetch: boolean;
}

type Action<T> =
  | { type: "START_FETCH" }
  | { type: "FETCHED"; payload: T }
  | { type: "ERROR"; payload: Error };

const fetchReducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case "START_FETCH":
      return { data: null, error: null, isLoading: true, startFetch: true };
    case "FETCHED":
      return {
        data: action.payload,
        error: null,
        isLoading: false,
        startFetch: false,
      };
    case "ERROR":
      return {
        data: null,
        error: action.payload,
        isLoading: false,
        startFetch: false,
      };
    default:
      return state;
  }
};

const getInitialState = <T>() => {
  return {
    data: null,
    error: null,
    isLoading: false,
    startFetch: false,
  } as State<T>;
};

const useFetch = <T>(url: string) => {
  const [state, dispatch] = useReducer<React.Reducer<State<T>, Action<T>>>(
    fetchReducer,
    getInitialState<T>()
  );
  const [options, setOptions] = useState({});
  const [alternateUrl, setAlternateUrl] = useState<null | string>(null);

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef(false);

  const doFetch = useCallback((options = {}, altUrl: string | null = null) => {
    setOptions(options);
    if (altUrl) setAlternateUrl(altUrl);
    dispatch({ type: "START_FETCH" });
  }, []);

  useEffect(() => {
    // Make sure we are not fetching on initial mount
    if (!state.startFetch) return;
    cancelRequest.current = false;

    const fetchData = async () => {
      try {
        console.log(url);
        const response = await fetch(alternateUrl || url, options);
        if (!response.ok) {
          console.error(await response.json());
          throw new Error(response.statusText);
        }
        const data = (await response.json()) as T;

        if (cancelRequest.current) return;

        dispatch({ type: "FETCHED", payload: data });
      } catch (error) {
        if (cancelRequest.current) return;
        dispatch({ type: "ERROR", payload: error as Error });
      } finally {
        setAlternateUrl(null);
      }
    };

    fetchData();

    return () => {
      cancelRequest.current = true;
    };
  }, [options, alternateUrl, state.startFetch, url]);

  return { state, doFetch };
};

export default useFetch;
