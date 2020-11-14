
import pgpromise from 'pg-promise';

const pgp = pgpromise();
const db = pgp(`${process.env.DB_CONN}`)

export default db;