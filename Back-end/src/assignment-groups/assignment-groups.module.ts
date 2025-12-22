import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AssignmentGroupsService } from './assignment-groups.service';
import { AssignmentGroupsController } from './assignment-groups.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AssignmentGroupsController],
  providers: [AssignmentGroupsService],
})
export class AssignmentGroupsModule {}
