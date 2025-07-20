import pool from './db-connect.js'

function addUrl(short, original) {
    const query = 'INSERT INTO linktable (short_link, og_link) VALUES ($1, $2) RETURNING *';
    return pool.query(query, [short, original])
}



function getUrlByShort(short) {
    const query = 'SELECT * FROM linktable WHERE short_link = $1';
    return pool.query(query, [short]);
}



function addClick(short) {
    const query = 'UPDATE linktable SET clicks = clicks + 1 WHERE short_link = $1';
    return pool.query(query, [short]);
}


//Add Index on your clicks column for better performance
function showLeaderboard() {
    const query = 'SELECT short_link, og_link, clicks FROM linktable ORDER BY clicks DESC LIMIT 10';
    return pool.query(query);
}






export { addUrl, getUrlByShort, addClick, showLeaderboard };