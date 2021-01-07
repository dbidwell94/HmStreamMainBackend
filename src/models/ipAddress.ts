import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";

import User from "./user";
import Auditable from "./auditable";

@Entity()
export default class IpAddress extends Auditable {
  @Column("varchar")
  address: string;

  @OneToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;
}
