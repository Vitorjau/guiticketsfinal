import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { AssignmentGroupsModule } from './assignment-groups/assignment-groups.module';
import { TasksModule } from './tasks/tasks.module';
import { InviteCodesController } from './invite-codes/invite-codes.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    TicketsModule,
    AuthModule,
    AssignmentGroupsModule,
    TasksModule,
  ],
  controllers: [AppController, InviteCodesController],
  providers: [AppService],
})
export class AppModule {}

