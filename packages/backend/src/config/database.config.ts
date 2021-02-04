import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const config = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../ormconfig.json')).toString()
    );
    return {
      url: process.env.APP_DATABASE_URL,
      autoLoadEntities: true,
      ...config
    };
  }
);
