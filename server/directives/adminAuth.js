const { SchemaDirectiveVisitor, ApolloError } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');
const { PrismaClient } = require('@prisma/client');
const { getAdminId } = require('../utils');
const prisma = new PrismaClient();

class AuthDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field) {
		const { resolve = defaultFieldResolver } = field;
		field.resolve = async function (...args) {
			// console.log(args)
			const [, , { req }] = args;

			const adminId = await getAdminId(req);
			// console.log(adminId);
			const admin = await prisma.admin.findUnique({ where: { id: adminId } });
			if (!admin) throw new ApolloError('Admin not found...');

			// saving user in req session
			// console.log(req.user)
			req.admin = admin;
			// console.log(req.user)

			// next()
			return resolve.apply(this, args);
		};
	}
}

module.exports = AuthDirective;
