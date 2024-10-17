import { PartialType } from '@nestjs/mapped-types';
import { CreateCommandOptionDto } from '../create-command/create-command-option.dto';

export class UpdateCommandOptionDto extends PartialType(
  CreateCommandOptionDto,
) {}
