import { MembersService } from '../service/members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { Member } from '../entities/member.entity';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    create(createMemberDto: CreateMemberDto): Promise<{
        message: string;
        data: Member;
    }>;
    findAll(): Promise<{
        message: string;
        data: Member[];
        count: number;
    }>;
    findOne(id: string): Promise<{
        message: string;
        data: Member;
    }>;
    update(id: string, updateData: Partial<CreateMemberDto>): Promise<{
        message: string;
        data: Member;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
