import {  
  Controller, 
  Get, 
  Post, 
  Param, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException,
  Res
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers/index';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileUploadDto } from './dto/file.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServices: ConfigService,
  ) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    }),
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product',
    type: FileUploadDto
  })
  @ApiResponse({ status: 201, description: `Image Uploaded`, type: FileUploadDto })
  @ApiResponse({ status: 400, description: `request information is not appropriate` })
  uploadProductImage( @UploadedFile() file: Express.Multer.File ) {
    if(!file) return new BadRequestException(`the file needs to be an image!`);

    const secureUrl = `${this.configServices.get<string>('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    };

  }

  @Get('product/:imageName')
  findOne( @Res() res:Response, @Param('imageName') imageName: string ) {

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile( path );
  }

}
