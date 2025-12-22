import { TaskStatusDto } from './create-task.dto';
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatusDto;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
