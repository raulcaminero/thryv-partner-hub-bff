import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BadRequestException } from '@nestjs/common';

export enum CustomerGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export enum CustomerGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export interface Customer {
  id: string;
  identification: string;
  name: string;
  lastname: string;
  dateBorn?: string | Date;
  gender?: CustomerGender;
  status?: CustomerStatus;
  createDate?: string;
  updateDate?: string;
  deletedAt?: string;
}