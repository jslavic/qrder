import React from "react";

import { ReactComponent as Amex } from "../../../../assets/cards/amex.svg";
import { ReactComponent as Diners } from "../../../../assets/cards/diners.svg";
import { ReactComponent as Discover } from "../../../../assets/cards/discover.svg";
import { ReactComponent as JCB } from "../../../../assets/cards/jcb.svg";
import { ReactComponent as Mastercard } from "../../../../assets/cards/mastercard.svg";
import { ReactComponent as UnionPay } from "../../../../assets/cards/unionpay.svg";
import { ReactComponent as Visa } from "../../../../assets/cards/visa.svg";
import { ReactComponent as UnkownCard } from "../../../../assets/cards/generic.svg";

type Props = {
  brand: string;
};

const CardIcon = ({ brand }: Props) => {
  switch (brand) {
    case "amex":
      return <Amex />;
    case "diners":
      return <Diners />;
    case "discover":
      return <Discover />;
    case "jcb":
      return <JCB />;
    case "mastercard":
      return <Mastercard />;
    case "unionpay":
      return <UnionPay />;
    case "visa":
      return <Visa />;
    default:
      return <UnkownCard />;
  }
};

export default CardIcon;
