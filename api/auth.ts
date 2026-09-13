import type { ServerResponse } from 'node:http';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../server/auth.js';
import type { ApiRequest } from '../server/api-types.js';

const handler = toNodeHandler(auth);

export default function authHandler(req: ApiRequest, res: ServerResponse) {
  const rawPath = req.query.path;
  const path = Array.isArray(rawPath) ? rawPath.join('/') : rawPath || '';
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path' || value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) query.append(key, item);
  }
  const suffix = query.size ? `?${query.toString()}` : '';
  req.url = `/api/auth/${path}${suffix}`;
  return handler(req, res);
}
