import { Outlet, useNavigate } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"
import {BASE_URL} from "../utils/constants"
import axios from "axios"
import {addUser} from "../utils/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"


function Body() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const fetchUser = async () => {
    if(userData) {
      return;
    }
    try{
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true
      });
      dispatch(addUser(res.data));
    } catch(err) {
      if(err.status === 401) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    if(!userData) {
      fetchUser()
    }
  }, []);
  return (
    <>
      {/* <div>Landing Page</div> */}
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}


export default Body
