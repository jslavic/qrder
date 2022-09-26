import { BadRequestException } from '@nestjs/common';
import multer from 'multer';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        'Please make sure your file ends with .jpg, .jpeg or .png',
      ),
    );
  }
};
