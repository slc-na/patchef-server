import { PartialType } from '@nestjs/mapped-types';
import { CreateCommandParameterDto } from '../create-command/create-command-parameter.dto';

export class UpdateCommandParameterDto extends PartialType(
  CreateCommandParameterDto,
) {}
