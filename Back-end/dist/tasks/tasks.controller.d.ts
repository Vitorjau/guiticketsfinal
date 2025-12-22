import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly service;
    constructor(service: TasksService);
    create(dto: CreateTaskDto): Promise<any>;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateTaskDto): Promise<any>;
    remove(id: string): Promise<any>;
}
