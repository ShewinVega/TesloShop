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

  @IsString()
  @MinLength(1)
  title: string;
  
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;
  
  @IsString()
  @IsOptional()
  slug?: string;
  
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({ each: true }) // "each" property indicates that each element of the array must be string 
  @IsArray()
  sizes: string[];
  
  @IsIn(['men','woman','kid','unisex']) // receives array of strings and we have to choose between the given options
  gender: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[]
  

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]


}
