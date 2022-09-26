export interface State {
  [key: string]: {
    value: string | boolean | number | number[];
    isTouched: boolean;
    isValid: boolean;
    validator: (value: any, state?: State) => boolean;
  };
}

export interface ActionGeneric<T extends string> {
  type: "INPUT" | "BLUR" | "TOGGLE" | "CHECKBOX" | "SUBMIT" | "RESET";
  field: T;
  payload?: any;
}

interface Action {
  type: "INPUT" | "BLUR" | "TOGGLE" | "CHECKBOX" | "SUBMIT" | "RESET";
  field: string;
  payload?: any;
}

export const formReducer = <T extends State, U extends Action>(
  state: T,
  action: U
) => {
  const selectedField = { ...state[action.field] };
  switch (action.type) {
    case "INPUT":
      selectedField.value = action.payload;
      if (selectedField.isTouched && !selectedField.isValid) {
        if (selectedField.validator(selectedField.value, state))
          selectedField.isValid = true;
      }
      break;
    case "BLUR":
      selectedField.isTouched = true;
      if (selectedField.validator(selectedField.value, state))
        selectedField.isValid = true;
      else selectedField.isValid = false;
      break;
    case "TOGGLE":
      selectedField.value = !selectedField.value;
      break;
    case "CHECKBOX":
      if (Array.isArray(selectedField.value)) {
        if (action.payload.checked) {
          if (!selectedField.value.includes(action.payload.value))
            selectedField.value.push(action.payload.value);
        } else
          selectedField.value = selectedField.value.filter(
            (item) => item !== action.payload.value
          );
      }
      break;
    case "SUBMIT":
      const newState = { ...state };
      Object.values(newState).forEach((value) => {
        value.isTouched = true;
      });
      return newState;
    case "RESET":
      return action.payload;
  }
  return { ...state, [action.field]: selectedField };
};
