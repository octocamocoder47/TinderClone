
import axios from "axios"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

function Login() {
  // We should define initial value to default like empty string other wise it will throw error that value is changing from undefined to something
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.Post(BASE_URL+"/login", {
        emailId,
        password,
      }, { withCredentials: true });
      dispatch(addUser(res.data));
      return navigate("/");
    } catch(err) {
      console.log(err.message);
    }
  };

  return (
    <>
      {/* <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input type="email" className="input" placeholder="Email" />

        <label className="label">Password</label>
        <input type="password" className="input" placeholder="Password" />

        <button className="btn btn-neutral mt-4">Login</button>
      </fieldset> */}
      <div className="flex justify-center my-10">
        <div className="card w-96 bg-base-200 card-md shadow-sm">
          <div className="card-body">
            <h2 className="card-title justify-center">Login</h2>
            <div>
              <fieldset className="fieldset my-2">
                <legend className="fieldset-legend">Email</legend>
                <input type="email" value={emailId} className="input" placeholder="youremail@gmail.com" onChange={(e) => setEmailId(e.target.value)} />
              </fieldset>
              <fieldset className="fieldset my-2">
                <legend className="fieldset-legend">Password</legend>
                <input type="password" value={password} className="input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </fieldset>
            </div>
            <div className="justify-center card-actions m-2">
              <button className="btn btn-primary" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Login
