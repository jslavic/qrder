import React, { ChangeEvent } from "react";

/** Function to recieve an onChange event handler which
 * conforms to the formReducer reducer function and update
 * its state accordingly
 */
export const getOnChangeHandler = <
  T extends HTMLInputElement | HTMLSelectElement
>(
  fieldName: string,
  dispatch: React.Dispatch<any>
) => {
  return (e: ChangeEvent<T>) => {
    dispatch({
      type: "INPUT",
      field: fieldName,
      payload: e.target.value,
    });
  };
};
