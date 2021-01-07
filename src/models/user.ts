import { Entity, Column, OneToOne, JoinColumn } from "typeorm";

import IpAddress from "./ipAddress";
import Auditable from "./auditable";

export enum userColumnsRequest {
  username = "username",
  password = "password",
  email = "email",
}

export type iUserMinimum = {
  username: string;
  password: string;
  email: string;
};

export type iUserReturnMinimum = {
  username: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
};

@Entity()
export default class User extends Auditable {
  @Column({ type: "varchar", length: 25, nullable: false, unique: true })
  username: string;

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column({ type: "varchar", length: 250 })
  email: string;

  @OneToOne(() => IpAddress)
  @JoinColumn({ name: "ipAddressId" })
  ipAddress: IpAddress;
}
