import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/model/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Import User entity to use Repository<User>
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  configure() {}
}
