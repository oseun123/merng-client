import React, { useState, useContext } from "react";
import { useForm, useValidateForm } from "../../util/hooks";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
const Register = (props) => {
  const context = useContext(AuthContext);
  const [serverErr, setServerErr] = useState({});
  const initRegisterUser = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  //callback
  const registerUserFromForm = () => {
    setServerErr({});
    addUser();
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    registerUserFromForm,
    initRegisterUser,
    useValidateForm
  );

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, result) {
      // console.log(result);
      context.login(result.data.register);
      props.history.push("/");
    },
    onError(err) {
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
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          value={values.username}
          onChange={handleChange}
          error={errors.username || serverErr.username}
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email || serverErr.email}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword || serverErr.confirmPassword}
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;
export default Register;
