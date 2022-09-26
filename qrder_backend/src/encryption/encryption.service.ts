import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService<T extends string | object | Buffer> {
  async encryptJson(data: T) {
    console.log(data);
    const stringifiedObject = JSON.stringify(data);
    return Buffer.from(stringifiedObject).toString('hex');
  }

  async decryptJson(hexEncodedData: string) {
    const stringifiedObject = Buffer.from(hexEncodedData, 'hex').toString();
    return (await JSON.parse(stringifiedObject)) as T;
  }
}
