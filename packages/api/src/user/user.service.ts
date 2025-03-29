import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../drizzle/drizzle.provider';
import * as schema from '../drizzle/schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase<typeof schema>,
  ) {}

  async create({ name, email, password }: CreateUserDto) {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.db
      .insert(schema.user)
      .values({ name, email, passwordHash } as schema.User)
      .returning();
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

  async resetPassword(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException(`User not found`);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    this.db
      .update(schema.user)
      .set({ passwordHash })
      .where(eq(schema.user.id, user.id))
      .execute();
  }

   
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
