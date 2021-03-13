const { gql } = require('apollo-server-express');

module.exports = gql`
	type Website {
		id: Int!
		url: String!
		title: String
		user: User
		status: Status
	}
	enum Status {
		SUBMITTED
		REJECTED
		APPROVED
	}

	extend type Query {
		websites: [Website!]!
	}
	extend type Mutation {
		post(url: String!, title: String, status: Status): Website! @auth
		updateStatus(id: Int!, status: Status!): Website! @adminAuth
	}
`;
