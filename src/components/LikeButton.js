import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Label, Icon } from "semantic-ui-react";
import MyPopup from "./MyPopup";

const LikeButton = ({ post: { id, likeCount, likes }, user }) => {
  const [serverErr, setServerErr] = useState({});
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost, { loading }] = useMutation(LIKE_POST_MUTATION, {
    update(proxy, result) {},
    onError(err) {
      //   console.log(err.graphQLErrors);
      setServerErr(
        err.graphQLErrors[0].extensions.exception.errors
          ? err.graphQLErrors[0].extensions.exception.errors
          : { servermessage: err.graphQLErrors[0].message }
      );
      console.log(serverErr);
    },
    variables: { postId: id },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="teal" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  );

  return (
    <MyPopup content={liked ? "Unlike" : "Like"}>
      <Button
        as="div"
        labelPosition="right"
        onClick={likePost}
        className={loading ? "loading" : ""}
      >
        {likeButton}
        <Label as="a" basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
