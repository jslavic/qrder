import React from "react";

/** Function to recieve an onBlur event handler which
 * conforms to the formReducer reducer function and update
 * its state accordingly
 */
export const getOnBlurHandler = (
  fieldName: string,
  dispatch: React.Dispatch<any>
) => {
  return () => {
    dispatch({ type: "BLUR", field: fieldName });
  };
};
