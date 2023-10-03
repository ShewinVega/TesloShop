import { Type } from 'class-transformer';
import {
  IsOptional, IsPositive, Min
} from 'class-validator';



export class PaginationDto {

  @IsOptional()
  @IsPositive()
  @Type( () => Number ) // is the same like this enableImplicitConversions: true in the globlobalPipes function from main.ts
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type( () => Number )
  offset?: number;

}