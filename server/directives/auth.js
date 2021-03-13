const { SchemaDirectiveVisitor, ApolloError } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const { PrismaClient } = require('@prisma/client');
const { getUserId } = require('../utils');
const prisma = new PrismaClient();

class AuthDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field;
		field.resolve = async function (...args) {
			// console.log(args)
			const [, , { req }] = args;

			const userId = await getUserId(req);
			const user = await prisma.user.findUnique({ where: { id: userId } });
			if (!user) throw new ApolloError('User not found...');

			req.user = user;

			return resolve.apply(this, args);
		};
	}
}

module.exports = AuthDirective;
