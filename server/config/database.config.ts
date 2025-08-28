import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from './config.service';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const dbConfig = configService.database;
  
  return {
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: dbConfig.entities,
    migrations: dbConfig.migrations,
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    migrationsRun: dbConfig.migrationsRun,
    autoLoadEntities: false,
    dropSchema: false,
    ssl: configService.isProduction ? { rejectUnauthorized: false } : false,
    extra: {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
    },
  };
};

