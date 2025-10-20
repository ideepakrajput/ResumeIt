import { createContext, useState, useContext } from "react";

// Create Context
const ResumeContext = createContext();

export const useNav = () => useContext(ResumeContext);

// Provider Component
export const ResumeProvider = ({ children }) => {
    // options: "" | "score" | "content"
  const [selectedPage, setSelectedPage] = useState(""); 
  return (
    <ResumeContext.Provider value={{ selectedPage, setSelectedPage }}>
      {children}
    </ResumeContext.Provider>
  );
};
