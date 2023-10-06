import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional, IsPositive, Min
} from 'class-validator';



export class PaginationDto {

  @ApiProperty({
    default: 10,
    description: `How many rows do you need to get back?`
  })
  @IsOptional()
  @IsPositive()
  @Type( () => Number ) // is the same like this enableImplicitConversions: true in the globlobalPipes function from main.ts
  limit?: number;

  @ApiProperty({
    default: 0,
    description: `How many rows do you want to skip?`
  })
  @IsOptional()
  @Min(0)
  @Type( () => Number )
  offset?: number;

}