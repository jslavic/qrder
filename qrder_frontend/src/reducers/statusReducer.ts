import { Reducer } from "react";

export enum StatusStates {
  NOT_INITIATED,
  LOADING,
  ERROR,
  SUCCESS,
}

export const statusReducer: Reducer<
  StatusStates,
  { type: "loading" | "failed" | "success" }
> = (state, action) => {
  switch (action.type) {
    case "loading":
      return StatusStates.LOADING;
    case "success":
      return StatusStates.SUCCESS;
    case "failed":
      return StatusStates.ERROR;
    default:
      return StatusStates.NOT_INITIATED;
  }
};
