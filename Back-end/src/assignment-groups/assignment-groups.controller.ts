import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AssignmentGroupsService } from './assignment-groups.service';
import { CreateAssignmentGroupDto } from './dto/create-assignment-group.dto';
import { UpdateAssignmentGroupDto } from './dto/update-assignment-group.dto';

@Controller('assignment-groups')
export class AssignmentGroupsController {
  constructor(private readonly service: AssignmentGroupsService) {}

  @Post()
  create(@Body() dto: CreateAssignmentGroupDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAssignmentGroupDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
