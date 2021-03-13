const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { APP_SECRET, getUserId } = require('../utils');
const website = require('../typeDefs/website');
const user = require('../typeDefs/user');
const { ApolloError } = require('apollo-server-errors');

module.exports = {
	Mutation: {
		signUp: async (parents, args, context, info) => {
			const checkEmail = await prisma.user.findUnique({
				where: {
					email: args.email
				}
			});
			if (checkEmail) throw new Error('Email taken');
			const password = await bcrypt.hash(args.password, 10);
			// create User
			const user = await prisma.user.create({
				data: {
					...args,
					password
				}
			});
			// Generate tokens
			const token = jwt.sign(
				{
					userId: user.id
				},
				APP_SECRET
			);
			console.log(user);
			return {
				user,
				token
			};
		},
		login: async (parent, args, context, info) => {
			const user = await prisma.user.findUnique({
				where: {
					email: args.email
				}
			});
			if (!user) throw new Error('User not Found');

			const checkPassword = await bcrypt.compare(args.password, user.password);
			if (!checkPassword) throw new Error('Invalid Password');

			//generate token
			const token = jwt.sign(
				{
					userId: user.id
				},
				APP_SECRET
			);
			console.log(user);
			return {
				token,
				user
			};
		},

		signUpAdmin: async (parents, args, context, info) => {
			const password = await bcrypt.hash(args.password, 10);
			// create Admin
			const admin = await prisma.admin.create({
				data: {
					...args,
					password
				}
			});
			console.log(admin);
			//generate token
			const token = jwt.sign(
				{
					adminId: admin.id
				},
				APP_SECRET
			);
			return {
				token,
				admin
			};
		},
		loginAdmin: async (parent, args, context, info) => {
			const admin = await prisma.admin.findUnique({
				where: {
					email: args.email
				}
			});
			if (!admin) throw new Error('Admin not Found');

			const checkPassword = await bcrypt.compare(args.password, admin.password);
			if (!checkPassword) throw new Error('Invalid Password');

			//generate token
			const token = jwt.sign(
				{
					adminId: admin.id
				},
				APP_SECRET
			);
			return {
				token,
				admin
			};
		},

		post: async (parent, { url, status, ...data }, context, info) => {
			const { user } = context.req;
			if (user) {
				data.user = {
					connect: {
						id: user.id
					}
				};
			}
			data.status = 'SUBMITTED';
			const myURL = new URL(url);
			data.url = myURL.host;
			const checkUrl = await prisma.website.findUnique({
				where: {
					url: data.url
				}
			});
			if (checkUrl) {
				throw new Error('Website already exist');
			}
			console.log(data);
			const website = await prisma.website.create({
				data
			});
			return website;
		},

		updateStatus: async (parents, { id, ...data }, context, info) => {
			const { admin } = context.req;
			if (!admin) throw new Error('You are not an Admin');

			const website = await prisma.website.findUnique({
				where: {
					id
				}
			});
			if (!website) throw new ApolloError('Website not found...');
			if (website.status !== 'SUBMITTED')
				throw new ApolloError('This website is already approved/rejected...');

			if (website.userId && data.status === 'APPROVED') {
				const user = await prisma.user.findUnique({
					where: {
						id: website.userId
					}
				});
				await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						coins: user.coins + 5
					}
				});
			}
			return prisma.website.update({
				where: {
					id
				},
				data
			});
		},

		deleteUser: async (parents, args, context, info) => {
			await prisma.user.delete({
				where: {
					id: args.id
				}
			});
			return 'User deleted';
		}
	}
};
