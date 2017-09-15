import { configure, connectLogger, getLogger, levels } from 'log4js';
import config from './config';

configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: {
    default: { appenders: ['console'], level: config.loglevel || levels.INFO } },
});

export const system = getLogger('system');
export const access = getLogger('access');
export const connect = connectLogger(access, { level: levels.INFO });
