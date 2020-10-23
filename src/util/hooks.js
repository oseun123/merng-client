import { useState } from "react";
export const useForm = (callback, initState = {}, validate, params = {}) => {
  const [values, setValues] = useState(initState);
  const [errors, setErrors] = useState({});

  // if (Object.keys(params).length !== 0 && params.clear_err) {
  //   if (Object.keys(errors).length !== 0) {
  //     setErrors({});
  //   }
  // }
  // if (Object.keys(params).length !== 0 && params.clear_val) {
  //   if (Object.keys(values).length !== 0 && values[params.clear_val] !== "") {
  //     setValues({ ...values, [params.clear_val]: "" });
  //   }
  // }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (Object.keys(validate(values)).length === 0) {
      callback();
      setErrors({});
    } else {
      setErrors(validate(values));
    }
  };

  return { handleChange, handleSubmit, errors, values };
};

export const useValidateForm = (values) => {
  let errors = {};
  if (values.hasOwnProperty("email") && values.email.trim() === "") {
    errors.email = "Must not be empty";
  } else if (values.hasOwnProperty("email")) {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!values.email.match(regEx)) {
      errors.email = "Must be a valid email address";
    }
  }
  if (values.hasOwnProperty("password") && values.password.trim() === "") {
    errors.password = "Must not be empty";
  }

  if (
    values.hasOwnProperty("confirmPassword") &&
    values.confirmPassword.trim() === ""
  ) {
    errors.confirmPassword = "Must not be empty";
  } else if (
    values.hasOwnProperty("confirmPassword") &&
    values.password.trim() !== values.confirmPassword.trim()
  ) {
    errors.confirmPassword = "Must match password";
  }
  if (values.hasOwnProperty("first_name") && values.first_name.trim() === "") {
    errors.first_name = "Must not be empty";
  }
  if (values.hasOwnProperty("username") && values.username.trim() === "") {
    errors.username = "Must not be empty";
  }
  if (values.hasOwnProperty("last_name") && values.last_name.trim() === "") {
    errors.last_name = "Must not be empty";
  }
  if (values.hasOwnProperty("name") && values.name.trim() === "") {
    errors.name = "Must not be empty";
  }
  if (values.hasOwnProperty("body") && values.body.trim() === "") {
    errors.body = "Must not be empty";
  }
  return errors;
};
