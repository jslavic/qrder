import React from "react";
import { StripeVerificationStatus } from "../../../../constants/enums/stripeVerificationStatus.enum";

import styles from "./IdentityStatusTag.module.css";

type Props = {
  status: StripeVerificationStatus;
};

const IdentityStatusTag = ({ status }: Props) => {
  switch (status) {
    case StripeVerificationStatus.UNVERIFIED:
      return <div className={styles.unverified}>niste potvrđeni</div>;
    case StripeVerificationStatus.PENDING:
      return <div className={styles.pending}>provjeravamo podatke</div>;
    case StripeVerificationStatus.VERFIFIED:
      return <div className={styles.verified}>potvrđeno</div>;
  }
};

export default IdentityStatusTag;
