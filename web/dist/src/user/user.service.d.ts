import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private db;
    constructor(db: NodePgDatabase<typeof schema>);
    create(name: string, email: string, password: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
