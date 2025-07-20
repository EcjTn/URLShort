import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DB_LINK
})

export default pool