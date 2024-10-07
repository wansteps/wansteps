import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): string;
}
