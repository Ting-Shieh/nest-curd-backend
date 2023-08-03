import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule], // 其他模塊export後，import該模塊
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
