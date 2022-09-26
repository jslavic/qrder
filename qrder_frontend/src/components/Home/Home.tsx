import React from "react";
import Header from "./Header/Header";
import Info from "./Info/Info";
import styles from "./Home.module.css";
import About from "./About/About";
import Pricing from "./Pricing/Pricing";
import Cta from "./Cta/Cta";

type Props = {};

const Home = (props: Props) => {
  return (
    <>
      <div className={styles.hero}>
        <Header />
        <Info />
      </div>
      <About />
      <Pricing />
      <Cta />
    </>
  );
};

export default Home;
