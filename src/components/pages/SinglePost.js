import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Grid,
  Image,
  Card,
  Icon,
  Label,
  Button,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "../LikeButton";
import DeleteButton from "../DeleteButton";
import MyPopup from "../MyPopup";

const SinglePost = (props) => {
  const [serverErr, setServerErr] = useState({});
  const [comment, setComment] = useState("");
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const deletePostCallback = () => {
    props.history.push("/");
  };
  // eslint-disable-next-line
  const [submitComment, { loading: mutationLoading }] = useMutation(
    SUBMIT_COMMENT_MUTATION,
    {
      update() {
        setComment("");
      },
      onError(err) {
        //   console.log(err.graphQLErrors);
        setServerErr(
          err.graphQLErrors[0].extensions.exception.errors
            ? err.graphQLErrors[0].extensions.exception.errors
            : { servermessage: err.graphQLErrors[0].message }
        );
        console.log(serverErr);
      },
      variables: {
        postId,
        body: comment,
      },
    }
  );

  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });
  let postMarkup;
  if (loading) {
    postMarkup = <p className="loading">Loading post..</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      likes,
      likeCount,
      comments,
      commentCount,
    } = data.getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />

                <MyPopup content="Comment on post">
                  <Button
                    labelPosition="right"
                    as="div"
                    onClick={() => console.log("comment on post")}
                  >
                    <Button color="blue" basic>
                      <Icon name="comments" />
                    </Button>
                    <Label as="a" basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form className={mutationLoading ? "loading" : ""}>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === "" || mutationLoading}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
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
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
