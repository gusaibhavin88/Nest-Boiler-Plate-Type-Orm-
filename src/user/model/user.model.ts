import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
