import { IUserService } from '@app/manager/user/user.service';
import { JwtAuthGuard } from '@app/modules/auth/guard/jwt-auth.guard';
import { IActiveUserData } from '@app/modules/auth/interface/active-user-data.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetUser } from 'libs/building-block/Decorators/getUser';
import { CreateUserDto } from 'libs/building-block/RequestableDTOs';
import { AssignCoursesDto } from 'libs/building-block/RequestableDTOs/user/assign-course.dto';
import { QueryUserDto } from 'libs/building-block/RequestableDTOs/user/query-user.dto';
import { UpdateUserDto } from 'libs/building-block/RequestableDTOs/user/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: IUserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({
    type: QueryUserDto,
    required: false,
    description: 'Optional query parameters',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all users',
    isArray: true,
  })
  findAll(@Query() queryUserDto: QueryUserDto) {
    return this.usersService.getAll(queryUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid user id',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a user by id',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid user id',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid user id',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @ApiOperation({
    summary: 'Assign courses to user',
    description: 'Assigns multiple courses to the currently authenticated user',
  })
  @Post(':id/assign-courses')
  async assignCourses(
    @Param('id') id: string,
    @Body() assignCoursesDto: AssignCoursesDto,
  ) {
    return await this.usersService.assignCourses(
      id,
      assignCoursesDto.courseIds,
    );
  }

  @ApiOperation({
    summary: 'Get user courses',
    description:
      'Retrieves all courses assigned to the currently authenticated user',
  })
  @Get('/courses/getAll')
  async getUserCourses(@GetUser() user: IActiveUserData) {
    return await this.usersService.getCoursesByUserId(user.id);
  }
}
