import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Users } from '../../entities/Users';

export default class SeedData implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const usersRepository = dataSource.getRepository(Users);

    await usersRepository.delete({});

    // users Seed 데이터 추가
    const userFactory = await factoryManager.get(Users);
    await userFactory.saveMany(10);
  }
}
