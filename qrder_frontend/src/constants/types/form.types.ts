export type StatePropertyValue<T> = {
  value: T;
  isTouched: boolean;
  isValid: boolean;
  validator: (value: T) => boolean;
};
