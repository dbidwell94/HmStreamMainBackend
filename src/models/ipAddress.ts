import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export default class IpAddress {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column("varchar")
    address: string;
}