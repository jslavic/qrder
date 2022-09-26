import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';

function MongooseOrdersSerializerInterceptor(
  classToIntercept: Type,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(document: PlainLiteralObject) {
      if (!(document instanceof Document)) {
        return document;
      }

      return plainToInstance(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ) {
      if (typeof response === 'object') {
        for (const key in response) {
          if (Array.isArray(response[key].orders)) {
            response[key].orders = response[key].orders.map(
              this.changePlainObjectToClass,
            );
          }
        }
        return response;
      }
      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ) {
      const serilaziedRes = super.serialize(
        this.prepareResponse(response),
        options,
      );
      return serilaziedRes;
    }
  };
}

export default MongooseOrdersSerializerInterceptor;
