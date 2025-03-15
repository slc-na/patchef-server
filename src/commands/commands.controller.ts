import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command/create-command.dto';
import { UpdateCommandDto } from './dto/update-command/update-command.dto';
import { CommandEntity } from './entities/command.entity';

@ApiTags('commands')
@Controller('commands')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @ApiBody({
    type: CreateCommandDto,
  })
  @ApiCreatedResponse({
    type: CommandEntity,
    description: 'The command has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid command data',
  })
  @ApiConflictResponse({
    description: 'Command already exists',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCommandDto: CreateCommandDto,
  ): Promise<CommandEntity> {
    return new CommandEntity(
      await this.commandsService.create(createCommandDto),
    );
  }

  @ApiBody({
    type: CommandEntity,
    isArray: true,
  })
  @ApiCreatedResponse({
    type: CommandEntity,
    isArray: true,
    description: 'The command has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid command data',
  })
  @ApiConflictResponse({
    description: 'Command already exists',
  })
  @Post('/bulk')
  @HttpCode(HttpStatus.CREATED)
  async createBulk(
    @Body() commandEntities: CommandEntity[],
  ): Promise<CommandEntity[]> {
    const commands = await this.commandsService.createBulk(commandEntities);
    return commands.map((command) => new CommandEntity(command));
  }

  @ApiOkResponse({ type: CommandEntity, isArray: true })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<CommandEntity[]> {
    const commands = await this.commandsService.findAll();
    return commands.map((command) => new CommandEntity(command));
  }

  @ApiOkResponse({ type: CommandEntity })
  @ApiNotFoundResponse({
    description: 'Command not found',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<CommandEntity> {
    return new CommandEntity(await this.commandsService.findOne(id));
  }

  @ApiBody({
    type: UpdateCommandDto,
  })
  @ApiOkResponse({ type: CommandEntity })
  @ApiNotFoundResponse({
    description: 'Command not found',
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCommandDto: UpdateCommandDto,
  ): Promise<CommandEntity> {
    return new CommandEntity(
      await this.commandsService.update(id, updateCommandDto),
    );
  }

  @ApiOkResponse({ type: CommandEntity })
  @ApiNotFoundResponse({
    description: 'Command not found',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<CommandEntity> {
    return new CommandEntity(await this.commandsService.remove(id));
  }
}
