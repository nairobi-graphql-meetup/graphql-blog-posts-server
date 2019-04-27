const { ApolloServer } = require('apollo-server');
const { generate } = require('shortid')

let data = require('./data');

const typeDefs = `
  type Query{
    "returns a list of our posts"
    posts: [post]!
    post(id: String!): post
  }

  type post{
    title: String
    id: String
    body: String
  }

  type Mutation{
    addPost(title: String!, body: String!): post
    deletePost(id: String!): post
    updatePost(id: String!, title: String, body: String): post
  }
`;


const findPost = (id) => data.posts.find((article) => article.id === id);

const resolvers = {
  Query: {
    posts: () => data.posts,
    post: (_, { id }) => findPost(id)
  },
  Mutation: {
    addPost: (_, {title, body}) => {
      const id = generate();
      const newPost = { title, body, id }
      data.posts = [...data.posts, newPost]
      return newPost;
    },
    deletePost: (_, { id }) => {
      const deletedPost = findPost(id);
      const newpostsArray = data.posts.filter((p) => p.id !== id);
      data.posts = newpostsArray;
      return deletedPost;
    },
    updatePost: (_, { id, title, body }) => {
      const newData = data.posts.map(item => {
        if(item.id === id){
          item = {...item, title: title || item.title, body: body || item.body }
          return item;
        }
        return item;
      });
      data.posts = newData;
      return findPost(id);
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen()
  .then(({ url }) => `🚀 started at ${url}`)
  .then(console.log);
