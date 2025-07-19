import { DataSource } from "typeorm";
import { Type } from "../entity/type.entity";
import { SubCategory } from "../entity/sub-category.entity";

export class TypesSeed {
    constructor(private dataSource: DataSource) {}

    async run(subCategories: SubCategory[]): Promise<Type[]> {
        const types = [
            // СТОЛОВАЯ
            // Аксессуары для стола
            { name: "Другие аксессуары", subCategory: subCategories[0] },
            { name: "Кольца для салфеток", subCategory: subCategories[0] },
            { name: "Подставки под стаканы", subCategory: subCategories[0] },
            { name: "Сосуды для масла и солонки", subCategory: subCategories[0] },
            // Ковры
            
            // Мебель
          
            // Подносы
        
            // Посуда
            { name: "Блюда", subCategory: subCategories[4] },
            { name: "Миски", subCategory: subCategories[4] },
            { name: "Тарелки", subCategory: subCategories[4] },
            { name: "Чашки и кружки", subCategory: subCategories[4] },
            // Скатери и салфетки
            { name: "Дорожки на стол", subCategory: subCategories[5] },
            { name: "Салфетки", subCategory: subCategories[5] },
            { name: "Салфетки под столовые приборы", subCategory: subCategories[5] },
            { name: "Скатерти", subCategory: subCategories[5] },
            // Стеклянная посуда
            { name: "Бокалы", subCategory: subCategories[6] },
            { name: "Кувшины", subCategory: subCategories[6] },
            { name: "Стаканы", subCategory: subCategories[6] },
            // Столовые приборы
            { name: "Наборы столовых приборов", subCategory: subCategories[7] },
            { name: "Столовые приборы для сервировки", subCategory: subCategories[7] },
            { name: "Столовые приборы", subCategory: subCategories[7] },

            // СПАЛЬНЯ
            // Декор
            { name: "Вазы", subCategory: subCategories[8] },
            { name: "Декоративные аксессуары", subCategory: subCategories[8] },
            { name: "Корзины", subCategory: subCategories[8] },
            { name: "Коробки", subCategory: subCategories[8] },
            { name: "Мебельные ручки и крючки", subCategory: subCategories[8] },
            { name: "Подсвечники", subCategory: subCategories[8] },
            { name: "Рамки для фотографий", subCategory: subCategories[8] },
            { name: "Свечи", subCategory: subCategories[8] },

            // Декоративные подушки
            // Зеркала — ПУСТО
            // Лампы и светильники — ПУСТО
            // Мебель
            { name: "Кофейные столики", subCategory: subCategories[12] },
            { name: "Стулья,Кресла и Табуреты", subCategory: subCategories[12] },
            // Одеяла и подушки
            { name: "Декоративные подушки", subCategory: subCategories[13] },
            { name: "Защитные чехлы", subCategory: subCategories[13] },
            { name: "Одеяла", subCategory: subCategories[13] },
            { name: "Подушки", subCategory: subCategories[13] },
            // Пледы — ПУСТО
            // Покрывала — ПУСТО
            // Постельное белье
            { name: "Защитные чехлы", subCategory: subCategories[16] },
            { name: "Наволочки", subCategory: subCategories[16] },
            { name: "Натяжные простыни", subCategory: subCategories[16] },
            { name: "Пододеяльники", subCategory: subCategories[16] },
            { name: "Простыни", subCategory: subCategories[16] },
            // Шторы — ПУСТО

            // ОДЕЖДА И ОБУВЬ
            // Вешалки — ПУСТО
            // Купальники — ПУСТО
            // Обувь — ПУСТО
            // Одежда
            { name: "Брюки и шорты", subCategory: subCategories[21] },
            { name: "Головные уборы", subCategory: subCategories[21] },
            { name: "Ночные рубашки", subCategory: subCategories[21] },
            { name: "Платья", subCategory: subCategories[21] },
            { name: "Футболки и топы", subCategory: subCategories[21] },
            { name: "Халаты", subCategory: subCategories[21] },
            // Сумки и нессеры — ПУСТО
            // Уход за изделиями — ПУСТО

            // КУХНЯ
            // Аксессуары для кухни — ПУСТО
            // Аксессуары для уборки — ПУСТО
            // Аксессуары для храненияи — ПУСТО
            // Кухонные полотенца и фартуки — ПУСТО

            // ДЕТИ
            // Детская одежда — ПУСТО
            // Детские товары — ПУСТО
            // Обувь — ПУСТО

            // ГОСТИНАЯ
            // Шторы — ПУСТО
            // Шкатулки и коробки — ПУСТО
            // Пледы — ПУСТО
            // Мебель
            { name: "Другое", subCategory: subCategories[34] },
            { name: "Столы", subCategory: subCategories[34] },
            { name: "Стулья, кресла и табуреты", subCategory: subCategories[34] },
            // Лампы и светильники — ПУСТО
            // Корзины — ПУСТО
            // Ковры — ПУСТО
            // Книги — ПУСТО
            // Канцтовары — ПУСТО
            // Зеркала — ПУСТО
            // Декоративные подушки — ПУСТО

            // ВАННАЯ
            // Аксессуары для ванной — ПУСТО
            // Зеркала — ПУСТО
            // Коврики для ванной — ПУСТО
            // Корзины — ПУСТО
            // Полотенца — ПУСТО
            // Халаты — ПУСТО
            // Шторы для ванной — ПУСТО

            // АРОМАТЫ
            // Ароматические саше — ПУСТО
            // Диффузоры с вулканическими камнями — ПУСТО
            // ДИФФУЗОРЫ С РОТАНГОВЫМИ ПАЛОЧКАМИ — ПУСТО
            // ДИФФУЗОРЫ-СПРЕИ — ПУСТО
            // ДЛЯ АВТОМОБИЛЯ — ПУСТО
            // Кремы для рук и тела — ПУСТО
            // Мыло — ПУСТО
            // Свечи — ПУСТО
        ];

        return await this.dataSource.getRepository(Type).save(types);
    }
} 