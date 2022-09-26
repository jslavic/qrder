import React, { useCallback, useEffect, useRef, useState } from "react";
import axios, { Canceler } from "axios";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import { ReactComponent as SearchIcon } from "../../../assets/search.svg";
import { ReactComponent as ErrorIcon } from "../../../assets/x-circle.svg";

import styles from "./SearchBar.module.css";

type Props<T> = {
  placeholder: string;
  fetchUrl: string;
  mapFunc: (results: T[], query: string) => JSX.Element[];
};

function SearchBar<T>({ placeholder, fetchUrl, mapFunc }: Props<T>) {
  const [searchInput, setSearchInput] = useState("");

  const [results, setResults] = useState<T[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cancelToken = useRef<Canceler | null>(null);

  const fetchData = useCallback(
    () => async () => {
      setIsLoading(true);
      setError(null);
      setResults(null);

      try {
        cancelToken.current && cancelToken.current();
        const results = await axios.get<T[]>(
          `${fetchUrl}?query=${searchInput.replace(" ", "+")}`,
          {
            withCredentials: true,
            cancelToken: new axios.CancelToken((canceler) => {
              cancelToken.current = canceler;
            }),
          }
        );
        setResults(results.data);
      } catch (error) {
        console.log(error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUrl, searchInput]
  );

  useEffect(() => {
    fetchData()();
  }, [searchInput, fetchData]);

  console.log(results);

  return (
    <div className={styles.searchDiv}>
      <SearchIcon className={styles.searchIcon} />
      <input
        type="text"
        id="searchInput"
        placeholder={placeholder}
        className={styles.searchBar}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {searchInput && isLoading && (
        <div className={styles.resultsBox}>
          <LoadingSpinner size={30} className={styles.loadingBox} />
        </div>
      )}
      {searchInput && error && !isLoading && (
        <div className={styles.resultsBox}>
          <div className={styles.errorBox}>
            <ErrorIcon className={styles.errorIcon} />
            <p className={styles.textError}>Nismo uspjeli učitati podatke</p>
          </div>
        </div>
      )}
      {searchInput && results && results.length !== 0 && !isLoading && (
        <div className={styles.resultsBox}>{mapFunc(results, searchInput)}</div>
      )}
    </div>
  );
}

export default SearchBar;
