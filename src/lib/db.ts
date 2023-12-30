import { Pool } from 'pg';

// remote pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT as unknown as number,
});

// local pool
const localPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'toilets_fyi',
  password: '',
  port: 5432,
});

export { localPool };
export default pool;