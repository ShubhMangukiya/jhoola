import { Navigate, useNavigate } from "react-router-dom";
import { userToken } from "../components/Variable.jsx";
import toast from "react-hot-toast";


const AdminRoute = ({ children }) => {
    const userData=userToken()
    const navigate=useNavigate()
  const token = userData?.token
  const role = userData?.role

  if (!token || role !== "admin") {
    toast.error('Please Login With Admin Credentials')
    navigate('/LoginPage');
  }

  return children;
};

export default AdminRoute;
