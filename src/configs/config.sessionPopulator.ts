import { UserConfig } from 'rm-session-populator';

export default {
  jwtMode: process.env.JWT_MODE,
  jwtHeaderName: process.env.JWT_HEADER_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtKeyLocation: process.env.JWT_KEY_LOCATION,
  authenticatorHost: process.env.AUTHENTICATOR_HOST,
  rejectWithoutAuthentication: false
} as UserConfig;
