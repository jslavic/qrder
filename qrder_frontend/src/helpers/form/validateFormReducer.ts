import { State } from "../../reducers/formReucer";

export const validateFormReducer = <T extends State>(formState: T) => {
  return Object.values(formState).reduce((previousValue, currentValue) => {
    if (!currentValue.validator!(currentValue.value, formState)) return false;
    return previousValue && currentValue.isValid;
  }, true);
};
