import React, { createContext, useReducer } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const initState = {
  user: null,
};

if (Cookies.get("jwtToken")) {
  const decodedtoken = jwtDecode(Cookies.get("jwtToken"));
  if (decodedtoken.exp * 1000 < Date.now()) {
    Cookies.remove("jwtToken");
  } else {
    initState.user = decodedtoken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});
// const AuthContext = createContext();

function authReducer(state = initState, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initState);
  function login(userData) {
    Cookies.set("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }
  function logout() {
    Cookies.remove("jwtToken");
    dispatch({
      type: "LOGOUT",
    });
  }
  // console.log(props);
  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
// eslint-disable-next-line
{
  /* <AuthContext.Provider value={{ user: state.user, login, logout }} {...props} />; */
}
