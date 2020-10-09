import { args } from '../services/arguments/service.parseArguments';

// MongoDB Database Parameters
const username: string = args.mongoUsername || process.env.MONGODB_USERNAME || 'testuser';
const password: string = args.mongoPassword || process.env.MONGODB_PASSWORD || 'mypass';
const host: string = args.mongoHost || process.env.MONGODB_HOST || 'localhost';
const port: string = args.mongoPort || process.env.MONGODB_PORT || '27017';
const database: string = args.mongoDb || process.env.MONGODB_DATABASE || 'query_bouncer';
const authDb: string = args.authDb || process.env.MONGODB_AUTHDB || 'admin';

const getConnectionString = (): string => {
  if(process.env.MONGODB_CONNECTION_STRING)
    return process.env.MONGODB_CONNECTION_STRING;
  return 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + database + '?authSource=' + authDb;
};

export { getConnectionString };
