import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiResponse({ status: 201, description: `Product was created`, type: Product })
  @ApiResponse({ status: 400, description: `the information got it is not the appropriate` })
  @ApiResponse({ status: 403, description: `User does not has the access. User unAuthorized` })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({ status: 200, description: `Product List`, type: Product })
  findAll( @Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiResponse({ status: 404, description: `Product not found!` })
  @ApiResponse({ status: 200, description: `Product`, type: Product })
  findOne(@Param('term') term: string ) {
    return this.productsService.findOneImagePlain(term);
  }

  @Patch(':id')
  @Auth( ValidRoles.user )
  @ApiResponse({ status: 200, description: `Product Updated`, type: Product })
  @ApiResponse({ status: 401, description: `Unauthorized. Users need to be logged` })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto, user:User) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @ApiResponse({ status: 401, description: `Unauthorized. User needs tobe logged` })
  @ApiResponse({ status: 403, description: `User does not has the access. User unAuthorized` })
  @ApiResponse({ status: 200, description: `Product Deleted`, type: Product })
  @Auth( ValidRoles.admin, ValidRoles.user )
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
