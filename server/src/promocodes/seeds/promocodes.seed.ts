import { DataSource } from 'typeorm';
import { Promocode } from '../entity/promocode.entity';

export class PromocodesSeed {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const repo = this.dataSource.getRepository(Promocode);

    const defaults: Array<Partial<Promocode>> = [
      { code: 'WELCOME10', discount: 10, isActive: true },
      { code: 'SALE15', discount: 15, isActive: true },
      { code: 'VIP25', discount: 25, isActive: true },
    ];

    for (const pc of defaults) {
      const exists = await repo.findOne({ where: { code: pc.code! } });
      if (!exists) {
        const entity = repo.create(pc);
        await repo.save(entity);
      }
    }

    console.log('Promocodes seeded');
  }
}


