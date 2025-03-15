import { Module } from '@nestjs/common';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaClientExceptionFilter, PrismaModule } from 'nestjs-prisma';
import { CommandsModule } from './commands/commands.module';
import { RecipesModule } from './recipes/recipes.module';
import { environmentSchema } from './config/environment.schema';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: environmentSchema,
      isGlobal: true,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    CommandsModule,
    RecipesModule,
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
