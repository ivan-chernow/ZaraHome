import { DataSource } from "typeorm";
import { SubCategory } from "../entity/sub-category.entity";
import { Category } from "../entity/category.entity";

export class SubCategoriesSeed {
    constructor(private readonly dataSource: DataSource) {}

    async run() {
        const categories = await this.dataSource.getRepository(Category).find();
        
        const subCategories = [

        // СТОЛОВАЯ
            { name: "Аксессуары для стола", category: categories[0] },
            { name: "Ковры", category: categories[0] },
            { name: "Мебель", category: categories[0] },
            { name: "Подносы", category: categories[0] },
            { name: "Посуда", category: categories[0] },
            { name: "Скатери и салфетки", category: categories[0] },
            { name: "Стеклянная посуда", category: categories[0] },
            { name: "Столовые приборы", category: categories[0] },

            // СПАЛЬНЯ
            { name: "Декор", category: categories[1] },
            { name: "Декоративные подушки", category: categories[1] },
            { name: "Зеркала", category: categories[1] },
            { name: "Лампы и светильники", category: categories[1] },
            { name: "Мебель", category: categories[1] },
            { name: "Одеяла и подушки", category: categories[1] },
            { name: "Пледы", category: categories[1] },
            { name: "Покрывала", category: categories[1] },
            { name: "Постельное белье", category: categories[1] },
            { name: "Шторы", category: categories[1] },

            // ОДЕЖДА И ОБУВЬ
            { name: "Вешалки", category: categories[2] },
            { name: "Купальники", category: categories[2] },
            { name: "Обувь", category: categories[2] },
            { name: "Одежда", category: categories[2] },
            { name: "Сумки и нессеры", category: categories[2] },
            { name: "Уход за изделиями", category: categories[2] },

              // КУХНЯ
              { name: "Аксессуары для кухни", category: categories[3] },
              { name: "Аксессуары для уборки", category: categories[3] },
              { name: "Аксессуары для храненияи", category: categories[3] },
              { name: "Кухонные полотенца и фартуки", category: categories[3] },
  
  // ДЕТИ
            { name: "Детская одежда", category: categories[4] },
            { name: "Детские товары", category: categories[4] },
            { name: "Обувь", category: categories[4] },

            // ГОСТИНАЯ
            { name: "Шторы", category: categories[5] },
            { name: "Шкатулки и коробки", category: categories[5] },
            { name: "Пледы", category: categories[5] },
            { name: "Мебель", category: categories[5] },
            { name: "Лампы и светильники", category: categories[5] },
            { name: "Корзины", category: categories[5] },
            { name: "Ковры", category: categories[5] },
            { name: "Книги", category: categories[5] },
            { name: "Канцтовары", category: categories[5] },
            { name: "Зеркала", category: categories[5] },
            { name: "Декоративные подушки", category: categories[5] },

          

            // ВАННАЯ
            { name: "Аксессуары для ванной", category: categories[6] },
            { name: "Зеркала", category: categories[6] },
            { name: "Коврики для ванной", category: categories[6] },
            { name: "Корзины", category: categories[6] },
            { name: "Полотенца", category: categories[6] },
            { name: "Халаты", category: categories[6] },
            { name: "Шторы для ванной", category: categories[6] },

            // АРОМАТЫ
            { name: "Ароматические саше", category: categories[7] },
            { name: "Диффузоры с вулканическими камнями", category: categories[7] },
            { name: "Диффузоры с ротанговыми палочками", category: categories[7] },
            { name: "Диффузоры-спреи", category: categories[7] },
            { name: "Для автомобиля", category: categories[7] },
            { name: "Кремы для рук и тела", category: categories[7] },
            { name: "Мыло", category: categories[7] },
            { name: "Свечи", category: categories[7] },

          
        ];

        return await this.dataSource.getRepository(SubCategory).save(subCategories);
    }
} 