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
  async create(@Body() createCommandDto: CreateCommandDto) {
    return new CommandEntity(
      await this.commandsService.create(createCommandDto),
    );
  }

  @ApiOkResponse({ type: CommandEntity, isArray: true })
  @Get()
  async findAll() {
    const commands = await this.commandsService.findAll();
    return commands.map((command) => new CommandEntity(command));
  }

  @ApiOkResponse({ type: CommandEntity })
  @ApiNotFoundResponse({
    description: 'Command not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
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
  async update(
    @Param('id') id: string,
    @Body() updateCommandDto: UpdateCommandDto,
  ) {
    return new CommandEntity(
      await this.commandsService.update(id, updateCommandDto),
    );
  }

  @ApiOkResponse({ type: CommandEntity })
  @ApiNotFoundResponse({
    description: 'Command not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new CommandEntity(await this.commandsService.remove(id));
  }
}
