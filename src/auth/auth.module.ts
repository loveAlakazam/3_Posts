import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './auth.strategy';
import { SessionSerializer } from './auth.session.serializer';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'local', session: true }),
  ],
  providers: [AuthService, AuthStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
