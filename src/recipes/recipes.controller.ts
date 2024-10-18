import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseInterceptors,
  ValidationPipe,
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
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeEntity } from './entities/recipe.entity';

@ApiTags('recipes')
@Controller('recipes')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseInterceptors(ClassSerializerInterceptor)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiBody({
    type: CreateRecipeDto,
  })
  @ApiCreatedResponse({
    type: RecipeEntity,
    description: 'The recipe has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid recipe data',
  })
  @ApiConflictResponse({
    description: 'Recipe already exists',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return new RecipeEntity(await this.recipesService.create(createRecipeDto));
  }

  @ApiOkResponse({ type: RecipeEntity, isArray: true })
  @Get()
  async findAll() {
    const recipes = await this.recipesService.findAll();
    return recipes.map((recipe) => new RecipeEntity(recipe));
  }

  @ApiOkResponse({ type: RecipeEntity })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new RecipeEntity(await this.recipesService.findOne(id));
  }

  @ApiBody({
    type: UpdateRecipeDto,
  })
  @ApiOkResponse({ type: RecipeEntity })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return new RecipeEntity(
      await this.recipesService.update(id, updateRecipeDto),
    );
  }

  @ApiOkResponse({ type: RecipeEntity })
  @ApiNotFoundResponse({
    description: 'Recipe not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return new RecipeEntity(await this.recipesService.remove(id));
  }
}
