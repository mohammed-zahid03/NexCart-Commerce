import React from "react";
import Footer from "./Footer";

const HomeSectionPage = ({ children }) => {
  return (
    <>
      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default HomeSectionPage;