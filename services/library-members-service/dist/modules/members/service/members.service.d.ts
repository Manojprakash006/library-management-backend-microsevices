import { Model } from 'mongoose';
import { Member, MemberDocument } from '../entities/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
export declare class MembersService {
    private memberModel;
    private readonly logger;
    constructor(memberModel: Model<MemberDocument>);
    create(createMemberDto: CreateMemberDto): Promise<Member>;
    findAll(): Promise<Member[]>;
    findOne(id: string): Promise<Member>;
    findByMemberId(memberId: string): Promise<Member>;
    update(id: string, updateData: Partial<CreateMemberDto>): Promise<Member>;
    remove(id: string): Promise<void>;
}
