import React from "react";
import Footer from "../Footer";
import Header from "../Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="mt-5 inner_top_mar">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
