import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../PostForm";
import { FETCH_POSTS_QUERY } from "../../util/graphql";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  return (
    <Grid columns={2} stackable>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        <Transition.Group animation="bounce" duration="500">
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
          {loading ? (
            <p className={loading ? "loading" : ""}>Loading ...</p>
          ) : (
            data &&
            data.getPosts.map((post) => (
              <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            ))
          )}
        </Transition.Group>
      </Grid.Row>
    </Grid>
  );
};

export default Home;
