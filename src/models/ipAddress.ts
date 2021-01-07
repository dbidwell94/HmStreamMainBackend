import { Entity, Column, OneToOne, JoinColumn } from "typeorm";

import User from "./user";
import Auditable from "./auditable";

export enum ipAddressColumnsRequest {
  address = "address",
  user = "userId",
}

export type iIpAddressMin = {
  address: string;
  userId: number;
};

@Entity()
export default class IpAddress extends Auditable {
  @Column("varchar")
  address: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;
}
