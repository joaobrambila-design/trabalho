const express = require('express');
const router = express.Router();
const BD = require('./db');

// Listar movimentações de estoque
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT m.id_movimentacao, m.tipo, m.quantidade, m.registro, m.descricao, 
                   p.nome AS produto_nome, u.nome AS usuario_nome 
            FROM movimentacoes m 
            JOIN produtos p ON m.id_produto = p.id_produto 
            JOIN usuarios u ON m.id_usuario = u.id_usuario 
            ORDER BY m.registro DESC
        `;
        const resultado = await BD.query(query);
        res.render('movimentacoes', { movimentacoes: resultado.rows });
    } catch (err) {
        console.error('Erro ao buscar movimentações:', err);
        res.status(500).send('Erro no banco de dados');
    }
});

module.exports = router;