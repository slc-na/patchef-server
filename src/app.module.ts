import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    CommandsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      inject: [HttpAdapterHost],
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
    },
  ],
})
export class AppModule {}
