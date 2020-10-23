import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useForm, useValidateForm } from "../util/hooks";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
  const [serverErr, setServerErr] = useState({});
  const initPost = {
    body: "",
  };
  //callback
  const postFromForm = () => {
    setServerErr({});
    createPost();
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    postFromForm,
    initPost,
    useValidateForm
  );

  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      const newData = {
        getPosts: [result.data.createPost, ...data.getPosts],
      };
      // console.log(newData);
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
      values.body = "";
    },
    onError(err) {
      //   console.log(err.graphQLErrors);
      setServerErr(
        err.graphQLErrors[0].extensions.exception.errors
          ? err.graphQLErrors[0].extensions.exception.errors
          : { servermessage: err.graphQLErrors[0].message }
      );
    },
    variables: values,
  });
  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h2>Create a post</h2>
        <Form.Input
          label="Username"
          placeholder="Hi World.."
          name="body"
          value={values.body}
          onChange={handleChange}
          error={errors.body || serverErr.body}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form>
      {Object.keys(serverErr).length > 0 && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
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
const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      username
      createdAt
      body
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
