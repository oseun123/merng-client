import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import "./App.css";
import Home from "./components/pages/Home";
import Register from "./components/pages/Register";
import SinglePost from "./components/pages/SinglePost";
import Login from "./components/pages/Login";
import MenuBar from "./components/MenuBar";
import { AuthProvider } from "./components/context/auth";
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
