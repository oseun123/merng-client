import React, { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "./MyPopup";

const DeleteButton = ({ postId, callback, commentId }) => {
  const [serverErr, setServerErr] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostORMutation, { loading }] = useMutation(mutation, {
    variables: {
      postId,
      commentId,
    },
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        const newData = {
          getPosts: data.getPosts.filter((p) => p.id !== postId),
        };
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData });
      }

      if (callback) callback();
    },
    onError(err) {
      setConfirmOpen(false);
      //   console.log(err.graphQLErrors);
      setServerErr(
        err.graphQLErrors[0].extensions.exception.errors
          ? err.graphQLErrors[0].extensions.exception.errors
          : { servermessage: err.graphQLErrors[0].message }
      );
      console.log(serverErr);
    },
  });
  // console.log(loading);
  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          onClick={() => setConfirmOpen(true)}
          floated="right"
          // className={loading ? "loading" : ""}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostORMutation}
        // className={loading ? "loading" : ""}
        size="mini"
      />
    </>
  );
};
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        username
        createdAt
        body
        id
      }
    }
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;
