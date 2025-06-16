import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity  ]), // Uncomment if you have a UserEntity
    // Add other necessary imports here, such as TypeOrmModule or any other modules you need
  ],
  controllers: [UsersController],
  providers: [UsersService],
   exports: [UsersService], 
})
export class UsersModule {}
