import { Hub, sseHub } from '@toverux/expresse';

export const hub = new Hub();

export const sseHubMiddleware = sseHub({ hub });