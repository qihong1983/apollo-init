import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import PostUpvoter from "../PostUpvoter";

import ErrorMessage from "../ErrorMessage";
import {
  Container,
  List,
  ListItem,
  ListItemContainer,
  Num,
  A,
  Button
} from "./styles";

const POSTS_PER_PAGE = 10;

const GET_POSTS = gql`
  query allPosts($first: Int!, $skip: Int!) {
    allPosts(orderBy: createdAt_DESC, first: $first, skip: $skip) {
      id
      title
      votes
      url
      createdAt
    }
    _allPostsMeta {
      count
    }
  }
`;

function PostList() {
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
    variables: { skip: 0, first: POSTS_PER_PAGE },
    notifyOnNetworkStatusChange: true
  });
  if (data && data.allPosts) {
    const areMorePosts = data.allPosts.length < data._allPostsMeta.count;
    return (
      <Container>
        <List data-testid="postListList">
          {data.allPosts.map((post, index) => (
            <ListItem key={post.id} data-testid="postListListItem">
              <ListItemContainer>
                <Num>{index + 1}. </Num>
                <A href={post.url}>{post.title}</A>
                <PostUpvoter id={post.id} votes={post.votes} />
              </ListItemContainer>
            </ListItem>
          ))}
        </List>
        {areMorePosts ? (
          <Button onClick={() => loadMorePosts(data, fetchMore)}>
            {loading ? "Loading..." : "Show More"}
          </Button>
        ) : (
          ""
        )}
      </Container>
    );
  }
  return <div>Loading...</div>;
}

function loadMorePosts(data, fetchMore) {
  return fetchMore({
    variables: {
      skip: data.allPosts.length
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) {
        return previousResult;
      }
      return Object.assign({}, previousResult, {
        // Append the new posts results to the old one
        allPosts: [...previousResult.allPosts, ...fetchMoreResult.allPosts]
      });
    }
  });
}

//自己的服务器
// const GET_POSTS = gql`
//   query getPosts($offset: Int!, $limit: Int!) {
//     getPosts(offset: $offset, limit: $limit) {
//       edges {
//       id
//       body
//       createdAt
//       user{
//         id
//         token
//       }
//     }
//     totalCount
//     }
//   }
// `;

// function PostList() {

//   const { loading, error, data, fetchMore } = useQuery(GET_POSTS, {
//     variables: { offset: 0, limit: POSTS_PER_PAGE },
//     notifyOnNetworkStatusChange: true
//   });

//   console.log(loading);

//     console.log(data && data.edges, 'data && data.edges');

//     if (data && data.getPosts) {
//       console.log(data.getPosts.edges[0].body);
//       return (
//       <div>
//         出现
//         {data.getPosts.edges.map((v,k)=> (
//           <div key={k}>
//             xxx{v.body}
//           </div>
//         ))}

//       </div>
//       );
//     }
//   // }
//   return <div>Loading...</div>;
// }

export default PostList;
