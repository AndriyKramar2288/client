"use client"

import { createContext, useContext, useState } from "react";

const MainContext = createContext(null)

export const useMainContext = () => {
    const context = useContext(MainContext)
    if (!context) throw new Error("Ідійота");
    return context;
}

export const MainContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
  
    return (
      <MainContext.Provider value={{ user, setUser }}>
        {children}
      </MainContext.Provider>
    );
};