const { gql } = require('apollo-server-express');
module.exports = gql`
	directive @auth on FIELD_DEFINITION
	directive @adminAuth on FIELD_DEFINITION
	type Query {
		_: Boolean
	}
	type Mutation {
		_: Boolean
	}
	type subscription {
		_: Boolean
	}
`;
