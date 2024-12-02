import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserModule } from 'src/user/user.module';
import { AuthenticationLogModule } from 'src/authenticationlog/authenticationlog.module';
dotenv.config();

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[UserModule,AuthenticationLogModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ]
})
export class AuthModule {}
