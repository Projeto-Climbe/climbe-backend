import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'crypto';

import { userModel } from '../model/userModel.js';
import { oauthAccountModel } from '../model/oauthAccountModel.js';
import { notificationsService } from './notificationsService.js';
import { sendApprovalEmail, sendManagerNotification, sendTemporaryPasswordEmail } from '../mailer.js';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  JWT_SECRET,
} = process.env;

let googleClient;

function ensureGoogleClient() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    throw new Error('Configurações do Google OAuth não foram definidas.');
  }

  if (!googleClient) {
    googleClient = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI,
    );
  }

  return googleClient;
}

function generateTemporaryPassword() {
  return randomBytes(9).toString('base64url').slice(0, 12);
}


function buildJwtPayload(user) {
  return {
    id: user.id,
    name: user.fullName,
    email: user.email,
    cpf: user.cpf,
    phone: user.phone,
    roleID: user.roleId,
  };
}

function generateJwtForUser(user) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado.');
  }

  return jwt.sign(buildJwtPayload(user), JWT_SECRET, { expiresIn: '2h' });
}

async function handleAdminNotifications(newUser) {
  const admins = await userModel.findByRoleName('admin');

  if (!admins || admins.length === 0) {
    return;
  }

  const message = `Novo cadastro via Google aguardando aprovação: ${newUser.fullName || newUser.email}`;

  try {
    await Promise.all(
      admins.map((admin) =>
        notificationsService.create({ userId: admin.id, message }),
      ),
    );
  } catch (error) {
    console.error('Falha ao criar notificações para administradores:', error);
  }
}

async function ensureUserExists({ email, fullName, providerUserId, picture }) {
  let user = await userModel.findByEmail(email);
  let isNewUser = false;

  if (!user) {
    isNewUser = true;

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    user = await userModel.save({
      fullName: fullName || email,
      email,
      cpf: `oauth-${providerUserId}`,
      phone: '0000000000',
      password: passwordHash,
      status: 'pending',
      profilePicture: picture,
      oauthProvider: 'google',
      oauthProviderId: providerUserId,
    });

    await sendTemporaryPasswordEmail(email, fullName || email, temporaryPassword);
    await sendApprovalEmail(email, fullName || email);
    await sendManagerNotification({ fullName: fullName || email, email });
    await handleAdminNotifications(user);
  } else {
    const updateData = {};

    if (fullName && fullName !== user.fullName) {
      updateData.fullName = fullName;
    }

    if (picture && picture !== user.profilePicture) {
      updateData.profilePicture = picture;
    }

    if (user.oauthProvider !== 'google') {
      updateData.oauthProvider = 'google';
    }

    if (user.oauthProviderId !== providerUserId) {
      updateData.oauthProviderId = providerUserId;
    }

    if (Object.keys(updateData).length > 0) {
      user = await userModel.update(user.id, updateData);
    }
  }

  return { user, isNewUser };
}

async function persistOAuthData({ userId, providerUserId, tokens, picture, profile }) {
  await oauthAccountModel.upsert({
    provider: 'google',
    providerUserId,
    userId,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    scope: tokens.scope,
    idToken: tokens.id_token,
    profilePicture: picture,
    rawProfile: profile,
    expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
  });
}

function buildPendingResponse(isNewUser) {
  const message = isNewUser
    ? 'Cadastro recebido. Aguarde a aprovação do administrador.'
    : 'Seu cadastro ainda não foi aprovado.';

  return {
    statusCode: isNewUser ? 202 : 403,
    body: {
      success: true,
      pending: true,
      message,
    },
  };
}

async function handleGoogleCallback({ code, state }) {
  const client = ensureGoogleClient();

  const { tokens } = await client.getToken(code);

  if (!tokens || !tokens.id_token) {
    throw new Error('Resposta do Google não contém token de identificação.');
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const email = payload?.email;
  const providerUserId = payload?.sub;

  if (!email || !providerUserId) {
    throw new Error('Não foi possível recuperar os dados do usuário do Google.');
  }

  const fullName = payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim();
  const picture = payload.picture;

  const { user, isNewUser } = await ensureUserExists({
    email,
    fullName,
    providerUserId,
    picture,
  });

  await persistOAuthData({
    userId: user.id,
    providerUserId,
    tokens,
    picture,
    profile: payload,
  });

  if (user.status !== 'approved') {
    return buildPendingResponse(isNewUser);
  }

  const token = generateJwtForUser(user);

  return {
    statusCode: 200,
    body: {
      success: true,
      user: token,
      profile: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        state,
      },
    },
  };
}

function getGoogleAuthUrl(state) {
  const client = ensureGoogleClient();

  const params = {
    access_type: 'offline',
    prompt: 'consent',
    scope: ['openid', 'email', 'profile'],
  };

  if (state) {
    params.state = state;
  }

  return client.generateAuthUrl(params);
}

export const authService = {
  getGoogleAuthUrl,
  handleGoogleCallback,
};


