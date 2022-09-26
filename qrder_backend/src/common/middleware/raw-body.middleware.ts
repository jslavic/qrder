import { Response } from 'express';
import { json } from 'body-parser';
import RequestWithRawBody from '../interface/requestWithRawBody.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Injectable, NestMiddleware } from '@nestjs/common';

function rawBodyMiddleware() {
  return json({
    verify: (
      request: RequestWithRawBody,
      response: Response,
      buffer: Buffer,
    ) => {
      if (Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  public use(req: Request, res: Response<any>, next: () => any) {
    ('called');
    json({
      verify: (
        request: RequestWithRawBody,
        response: Response,
        buffer: Buffer,
      ) => {
        if (Buffer.isBuffer(buffer)) {
          request.rawBody = Buffer.from(buffer);
        }
        return true;
      },
    })(req as any, res as any, next);
  }
}

export default rawBodyMiddleware;
