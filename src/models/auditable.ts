import { Column, PrimaryGeneratedColumn } from "typeorm";

export default abstract class Auditable {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
