import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';

@Injectable()
export class DatabaseService {
  public users: User[] = [];
}
