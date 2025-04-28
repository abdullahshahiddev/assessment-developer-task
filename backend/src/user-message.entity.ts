import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column('simple-array')
  items: number[];
}
