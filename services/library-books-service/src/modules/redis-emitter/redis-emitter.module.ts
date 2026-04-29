import { Module, Global } from '@nestjs/common';
import { RedisEmitterService } from './redis-emitter.service';

@Global()
@Module({
  providers: [RedisEmitterService],
  exports: [RedisEmitterService],
})
export class RedisEmitterModule {}
