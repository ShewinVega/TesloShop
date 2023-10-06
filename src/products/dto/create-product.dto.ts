import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString,
  MinLength,
  IsNumber,
  IsPositive,
  IsOptional,
  IsInt,
  IsArray,
  IsIn,
} from 'class-validator';



export class CreateProductDto {

  @ApiProperty({
    description: ` Product  title (unique)`,
    nullable: false,
    minLength: 2
  })
  @IsString()
  @MinLength(1)
  title: string;
  
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty()
  @IsString({ each: true }) // "each" property indicates that each element of the array must be string 
  @IsArray()
  sizes: string[];

  @ApiProperty()
  @IsIn(['men','woman','kid','unisex']) // receives array of strings and we have to choose between the given options
  gender: string;

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[]
  
  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]


}
