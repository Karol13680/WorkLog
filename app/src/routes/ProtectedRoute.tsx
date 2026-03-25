import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return isSignedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;