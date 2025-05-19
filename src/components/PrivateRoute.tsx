import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) return <div>Loading...</div>;
  console.log(isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
