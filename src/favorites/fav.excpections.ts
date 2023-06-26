import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidIdException extends HttpException {
  constructor() {
    super('Invalid ID', HttpStatus.BAD_REQUEST);
  }
}

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string) {
    super(`${entityName} not found`, HttpStatus.NOT_FOUND);
  }
}
