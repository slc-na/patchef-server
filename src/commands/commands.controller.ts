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
} from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command/create-command.dto';
import { UpdateCommandDto } from './dto/update-command/update-command.dto';
import { CommandEntity } from './entities/command.entity';

@Controller('commands')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  async create(@Body() createCommandDto: CreateCommandDto) {
    return new CommandEntity(
      await this.commandsService.create(createCommandDto),
    );
  }

  @Get()
  async findAll() {
    const commands = await this.commandsService.findAll();
    return commands.map((command) => new CommandEntity(command));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new CommandEntity(await this.commandsService.findOne(id));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommandDto: UpdateCommandDto,
  ) {
    return new CommandEntity(
      await this.commandsService.update(id, updateCommandDto),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new CommandEntity(await this.commandsService.remove(id));
  }
}
