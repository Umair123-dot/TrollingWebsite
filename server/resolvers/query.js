const { PrismaClient, Prisma } = require('@prisma/client');
const user = require('../typeDefs/user');
const prisma = new PrismaClient();

module.exports = {
	Query: {
		users: async () => {
			const users = await prisma.user.findMany();
			return users;
		},
		websites: async () => {
			const urls = await prisma.website.findMany();
			return urls;
		}
	},
	Website: {
		async user(parent) {
			if (!parent.userId) return null;
			return prisma.user.findUnique({
				where: {
					id: parent.userId
				}
			});
		}
	},
	User: {
		async website(parent) {
			return prisma.website.findMany({
				where: {
					userId: parent.id
				}
			});
		}
	}
};
