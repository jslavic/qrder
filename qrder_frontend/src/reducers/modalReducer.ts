import { AddonDto } from "../constants/dto/items/addon.dto";
import { DiscountDto } from "../constants/dto/items/discount.dto";
import { ProductDto } from "../constants/dto/items/product.dto";

export interface State {
  product: {
    type: false | "ADD" | "EDIT" | "DELETE";
    item: ProductDto | undefined;
  };
  discount: {
    type: false | "ADD" | "EDIT" | "DELETE";
    item: DiscountDto | undefined;
  };
  addon: {
    type: false | "ADD" | "EDIT" | "DELETE";
    item: AddonDto | undefined;
  };
}

export interface Action {
  type:
    | {
        field: "PRODUCT" | "DISCOUNT" | "ADDON";
        action: "ADD" | "EDIT" | "DELETE";
      }
    | "CLOSE";

  payload?: any;
}

export const modalReducer = (state: State, action: Action) => {
  const defaultState: State = {
    product: { type: false, item: undefined },
    discount: { type: false, item: undefined },
    addon: { type: false, item: undefined },
  };

  if (action.type === "CLOSE") return defaultState;
  if (action.type.field === "PRODUCT") {
    if (action.type.action === "ADD") {
      defaultState.product.type = "ADD";
      return defaultState;
    }
    if (action.type.action === "EDIT") {
      defaultState.product.type = "EDIT";
      defaultState.product.item = action.payload;
      return defaultState;
    }
    if (action.type.action === "DELETE") {
      defaultState.product.type = "DELETE";
      defaultState.product.item = action.payload;
    }
  }
  if (action.type.field === "DISCOUNT") {
    if (action.type.action === "ADD") {
      defaultState.discount.type = "ADD";
      return defaultState;
    }
    if (action.type.action === "EDIT") {
      defaultState.discount.type = "EDIT";
      defaultState.discount.item = action.payload;
      return defaultState;
    }
    if (action.type.action === "DELETE") {
      defaultState.discount.type = "DELETE";
      defaultState.discount.item = action.payload;
    }
  }
  if (action.type.field === "ADDON") {
    if (action.type.action === "ADD") {
      defaultState.addon.type = "ADD";
      return defaultState;
    }
    if (action.type.action === "EDIT") {
      defaultState.addon.type = "EDIT";
      defaultState.addon.item = action.payload;
      return defaultState;
    }
    if (action.type.action === "DELETE") {
      defaultState.addon.type = "DELETE";
      defaultState.addon.item = action.payload;
    }
  }
  return defaultState;
};
