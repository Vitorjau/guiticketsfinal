export declare enum TaskStatusDto {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE"
}
export declare class CreateTaskDto {
    id: string;
    title: string;
    description?: string;
    status?: TaskStatusDto;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}
