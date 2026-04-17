import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

import bytes from 'bytes';
import { z } from 'zod';

import CommonMessage from '../constants/common-message';

interface FileValidationPipeOptions {
  maxSize?: string;
  allowedTypes?: z.core.util.MimeTypes[];
  requiredFile?: boolean;
}

type FileType = Express.Multer.File | Express.Multer.File[] | Record<string, Express.Multer.File[]>;

class FileValidationPipe implements PipeTransform {
  private readonly maxFileSize: number;

  constructor(private readonly options: FileValidationPipeOptions) {
    this.maxFileSize = bytes(options.maxSize ?? '1mb') as number;
  }

  transform(fileData: FileType, _metadata: ArgumentMetadata) {
    const { requiredFile = false } = this.options;

    const isEmpty = !fileData;
    const isArrayEmpty = Array.isArray(fileData) && fileData.length === 0;
    const isObjectEmpty = typeof fileData === 'object' && fileData !== null && Object.keys(fileData).length === 0;

    if (isEmpty || isArrayEmpty || isObjectEmpty) {
      if (requiredFile) throw new BadRequestException(CommonMessage.FILE_REQUIRED);
      return fileData;
    }

    if (Array.isArray(fileData)) {
      fileData.forEach((file) => this.validateSingleFile(file));
    } else if (typeof fileData === 'object') {
      if ('buffer' in fileData) {
        this.validateSingleFile(fileData as Express.Multer.File);
      } else {
        const files = Object.values(fileData).flat();
        files.forEach((file) => this.validateSingleFile(file));
      }
    }

    return fileData;
  }

  private validateSingleFile(file: Express.Multer.File) {
    const { size, mimetype } = file;
    const { allowedTypes } = this.options;

    if (size > this.maxFileSize) throw new BadRequestException(CommonMessage.INVALID_FILE_SIZE);
    if (allowedTypes && !allowedTypes.includes(mimetype)) {
      throw new BadRequestException(CommonMessage.INVALID_FILE_TYPE);
    }
  }
}

export default FileValidationPipe;
