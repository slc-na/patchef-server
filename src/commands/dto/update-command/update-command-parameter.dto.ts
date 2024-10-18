import { PartialType } from '@nestjs/swagger';
import { CreateCommandParameterDto } from '../create-command/create-command-parameter.dto';

export class UpdateCommandParameterDto extends PartialType(
  CreateCommandParameterDto,
) {}
