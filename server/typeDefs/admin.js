const { gql } = require('apollo-server-express');

module.exports = gql`
	type Admin {
		id: Int!
		email: String!
		name: String!
		password: String!
	}

	type AuthAdmin {
		token: String!
		admin: Admin!
	}
	#   extend type Query {
	#     # users: [User!]!
	#   }
	extend type Mutation {
		signUpAdmin(email: String!, name: String!, password: String!): AuthAdmin!
		loginAdmin(email: String!, password: String!): AuthAdmin!
	}
`;
