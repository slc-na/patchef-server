import { PartialType } from '@nestjs/swagger';
import { CreateCommandOptionDto } from '../create-command/create-command-option.dto';

export class UpdateCommandOptionDto extends PartialType(
  CreateCommandOptionDto,
) {}
