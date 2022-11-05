import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard, AuthLocalGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @url [POST] /api/auth/signUp
   * @description: 회원가입을 통해 사용자 정보를 저장.
   */
  @Post('signUp')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Res() res,
  ): Promise<void> {
    await this.authService.signUp(createUserDto);
    res.status(HttpStatus.CREATED);
  }

  /**
   * @url [POST] /api/auth/login
   * @description 로그인 성공/실패 여부를 반환
   */
  @UseGuards(AuthLocalGuard)
  @Post('login')
  login(): void {}

  /**
   * @url [GET] /api/auth/logout
   * @description 로그아웃 처리를 위해 세션제거
   */
  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  logout(@Req() req): void {
    req.session.destroy();
  }
}
