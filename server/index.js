const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const schemaDirectives = require('./directives');

const server = new ApolloServer({
	typeDefs,
	resolvers,
	schemaDirectives,
	context: ({ req, res }) => ({
		req,
		res
	})
});

server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
