import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class TransactionHelper {
  constructor(private readonly dataSource: DataSource) {}

  async start() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}