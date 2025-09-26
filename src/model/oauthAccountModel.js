import prisma from '../utils/prismaClient.js';

export const oauthAccountModel = {
  upsert: async ({ provider, providerUserId, ...data }) =>
    prisma.oAuthAccount.upsert({
      where: { provider_providerUserId: { provider, providerUserId } },
      update: data,
      create: { provider, providerUserId, ...data }
    }),

  findByProviderUserId: async (provider, providerUserId) =>
    prisma.oAuthAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } }
    })
};
