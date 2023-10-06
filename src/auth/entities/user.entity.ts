import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity('users')
export class User {

  @ApiProperty({
    example: `08f56ce4-5b0a-47d6-bc5e-8569bd25e4ab`,
    description: `User ID`,
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @ApiProperty({
    type: String,
    nullable: false,
    uniqueItems: true
  })
  @Column('text',{
    unique: true,
  })
  email: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @Column('text',{
    select: false,
  })
  password: string;

  @ApiProperty({
    type: String,
    description: `Name and surname of the user`,
    nullable: false,
  })
  @Column('text',{
  })
  fullName: string;

  @ApiProperty({
    type: Boolean,
    description: `user's status`,
    nullable: true,
  })
  @Column('bool',{
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    enum: ['admin','superuser','user'],
    description: `Roles in order to get access from the system`
  })
  @Column('text',{
    array: true,
    default: ['user']
  })  
  roles: string[]; 

  // @ApiProperty()
  @OneToMany(
    () => Product,
    (product) => product.registerBy,
  )
  product:Product;

  @BeforeInsert()
  checkEmailBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkEmailBeforeUpdate() {
    this.checkEmailBeforeInsert();
  }

}
