import { DataSource } from "typeorm";
import { CategoriesSeed } from "../../products/seeds/categories.seed";
import { SubCategoriesSeed } from "../../products/seeds/sub-categories.seed";
import { TypesSeed } from "../../products/seeds/types.seed";
import { Category } from "../../products/entity/category.entity";
import { SubCategory } from "../../products/entity/sub-category.entity";

export class DatabaseSeeder {
    constructor(private readonly dataSource: DataSource) {}

    async run() {
        try {
            // Запускаем сиды в правильном порядке
            await this.runCategoriesSeed();
            const subCategories = await this.runSubCategoriesSeed();
            await this.runTypesSeed(subCategories);
            
            console.log('All seeds completed successfully');
        } catch (error) {
            console.error('Error running seeds:', error);
            throw error;
        }
    }

    private async runCategoriesSeed() {
        const categoriesSeed = new CategoriesSeed(this.dataSource);
        await categoriesSeed.run();
    }

    private async runSubCategoriesSeed() {
        const subCategoriesSeed = new SubCategoriesSeed(this.dataSource);
        return await subCategoriesSeed.run();
    }

    private async runTypesSeed(subCategories: SubCategory[]) {
        const typesSeed = new TypesSeed(this.dataSource);
        await typesSeed.run(subCategories);
    }
} 