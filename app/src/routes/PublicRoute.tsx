import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import type { JSX } from "react";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return !isSignedIn ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;