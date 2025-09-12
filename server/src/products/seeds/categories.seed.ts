import { DataSource } from 'typeorm';
import { Category } from '../entity/category.entity';

export class CategoriesSeed {
  constructor(private readonly dataSource: DataSource) {}

  async run() {
    const categories = [
      { name: 'Столовая' },
      { name: 'Спальня' },
      { name: 'Одежда и обувь' },
      { name: 'Кухня' },
      { name: 'Дети' },
      { name: 'Гостиная' },
      { name: 'Ванная' },
      { name: 'Ароматы' },
      { name: 'Новинки' },
      { name: 'Скидки' },
    ];

    return await this.dataSource.getRepository(Category).save(categories);
  }
}
