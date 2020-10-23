import React, { useState, useContext } from "react";
import { useForm, useValidateForm } from "../../util/hooks";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";

const Login = (props) => {
  const context = useContext(AuthContext);
  const [serverErr, setServerErr] = useState({});
  const initLoginUser = {
    username: "",
    password: "",
  };
  //callback
  const loginUserFromForm = () => {
    setServerErr({});
    loginUser();
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    loginUserFromForm,
    initLoginUser,
    useValidateForm
  );

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, result) {
      context.login(result.data.login);
      props.history.push("/");
    },
    onError(err) {
      // console.log(err.graphQLErrors[0].extensions.exception.errors);
      setServerErr(
        err.graphQLErrors[0].extensions.exception.errors
          ? err.graphQLErrors[0].extensions.exception.errors
          : { servermessage: err.graphQLErrors[0].message }
      );
    },
    variables: values,
  });
  return (
    <div className="form-container">
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Sign In</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          value={values.username}
          onChange={handleChange}
          error={errors.username || serverErr.username}
        />

        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password || serverErr.password}
          type="password"
        />

        <Button type="submit" primary>
          Submit
        </Button>
      </Form>
      {Object.keys(serverErr).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(serverErr).map((value) => (
              <li key={value}> {value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
export default Login;
