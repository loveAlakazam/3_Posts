import { Module } from '@nestjs/common';
import { MySqlConfigService } from './configs.service';

@Module({
  providers: [MySqlConfigService],
})
export class MySqlConfigModule {}
