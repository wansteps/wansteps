import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { UpdateUserDto } from './dto/update-user.dto';


@Injectable()
export class UserService {
  constructor(@Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>) { }

  async create(name: string, email: string, password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const userData = { name, email, hashedPassword };
    return this.db.insert(schema.user).values(userData).returning();
  }

  async findByEmail(email: string) {
    return this.db.query.user.findFirst({
      where: eq(schema.user.email, email),
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
