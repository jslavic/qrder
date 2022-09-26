import React from "react";
import FormBox from "./FormBox/FormBox";

import commonStyles from "./Common.module.css";

type Props = {
  title: React.ReactNode; // Title is react node because it should have highlighted text
  desc?: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  children: React.ReactNode;
};

const Form = ({ title, desc, onSubmit, children }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <FormBox title={title} desc={desc}>
      <form className={commonStyles.form} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormBox>
  );
};

export default Form;
