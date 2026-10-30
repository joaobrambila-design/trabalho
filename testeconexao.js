const db = require('./db');

async function testarConexao() {
    try {
        const resultado = await db.query('SELECT NOW() AS data_atual, current_database() AS banco');
        console.log('--------------------------------------------------');
        console.log('✅ Conexão ao PostgreSQL realizada com sucesso!');
        console.log(`Base de Dados conectada: ${resultado.rows[0].banco}`);
        console.log(`Data/Hora do Servidor DB: ${resultado.rows[0].data_atual}`);
        console.log('--------------------------------------------------');
        process.exit(0);
    } catch (err) {
        console.error('--------------------------------------------------');
        console.error('❌ Erro de conexão com o PostgreSQL:');
        console.error(err.message);
        console.error('--------------------------------------------------');
        process.exit(1);
    }
}

testarConexao();