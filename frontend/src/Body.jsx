import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"


function Body() {
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
