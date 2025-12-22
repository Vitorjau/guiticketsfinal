import { AssignmentGroupsService } from './assignment-groups.service';
import { CreateAssignmentGroupDto } from './dto/create-assignment-group.dto';
import { UpdateAssignmentGroupDto } from './dto/update-assignment-group.dto';
export declare class AssignmentGroupsController {
    private readonly service;
    constructor(service: AssignmentGroupsService);
    create(dto: CreateAssignmentGroupDto): Promise<any>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateAssignmentGroupDto): Promise<any>;
    remove(id: string): Promise<any>;
}
