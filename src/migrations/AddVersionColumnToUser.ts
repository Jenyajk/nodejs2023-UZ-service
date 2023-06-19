import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddVersionColumnToUser implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'version',
        type: 'integer',
        default: 1,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'version');
  }
}
