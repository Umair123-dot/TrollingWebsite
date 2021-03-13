const { gql } = require('apollo-server-express');

module.exports = gql`
	type User {
		id: Int!
		email: String!
		name: String!
		password: String!
		phoneNumber: String!
		gender: String
		coins: Int
		website: [Website]
	}

	type AuthUser {
		token: String!
		user: User!
	}
	extend type Query {
		users: [User!]!
	}
	extend type Mutation {
		signUp(
			email: String!
			name: String!
			password: String!
			phoneNumber: String!
			gender: String
		): AuthUser!
		login(email: String!, password: String!): AuthUser!
		deleteUser(id: Int!): String!
	}
`;
