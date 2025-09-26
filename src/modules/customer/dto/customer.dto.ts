import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CustomerGender, CustomerStatus } from '../entities/customer.entity';
import { InputType, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CustomerGql {
  @Field(() => ID)
  id: string;

  @Field()
  identification: string;

  @Field()
  name: string;

  @Field()
  lastname: string;

  @Field({ nullable: true })
  dateBorn?: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  createDate?: string;

  @Field({ nullable: true })
  updateDate?: string;
}

@InputType()
export class CreateCustomerDto {
  @Field()
  @ApiProperty({ description: 'Customer identification number', maxLength: 25 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  identification: string;

  @Field()
  @ApiProperty({ description: 'Customer first name', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @Field()
  @ApiProperty({ description: 'Customer last name', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  lastname: string;

  @Field()
  @ApiProperty({ description: 'Customer birth date (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  dateBorn: string;

  // Keep enum typing, expose in GraphQL as string
  @Field(() => String)
  @ApiProperty({ description: 'Customer gender', enum: CustomerGender })
  @IsNotEmpty()
  @IsEnum(CustomerGender)
  gender: CustomerGender;

  @Field(() => String, { nullable: true })
  @ApiProperty({ description: 'Customer status', enum: CustomerStatus, required: false })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;
}

@InputType()
export class UpdateCustomerDto {
  @Field({ nullable: true })
  @ApiProperty({ description: 'Customer identification number', maxLength: 25, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  identification?: string;

  @Field({ nullable: true })
  @ApiProperty({ description: 'Customer first name', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @Field({ nullable: true })
  @ApiProperty({ description: 'Customer last name', maxLength: 50, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  lastname?: string;

  @Field({ nullable: true })
  @ApiProperty({ description: 'Customer birth date (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  dateBorn?: string;

  @Field(() => String, { nullable: true })
  @ApiProperty({ description: 'Customer gender', enum: CustomerGender, required: false })
  @IsOptional()
  @IsEnum(CustomerGender)
  gender?: CustomerGender;

  @Field(() => String, { nullable: true })
  @ApiProperty({ description: 'Customer status', enum: CustomerStatus, required: false })
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;
}