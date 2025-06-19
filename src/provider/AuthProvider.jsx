"use client";
import { createContext, useState } from "react";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const authInfo = {
    paymentInfo,
    setPaymentInfo,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
