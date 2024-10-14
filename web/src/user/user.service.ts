import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
  ) {}

  async create({ name, email, password }: CreateUserDto) {
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

  async findOne(id: number) {
    const user = await this.db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });
    if (!user) {
      throw new BadRequestException(`User not found`);
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
