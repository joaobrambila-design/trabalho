const express = require('express');
const router = express.Router();
const BD = require('./db');

// Listar produtos com o nome da categoria
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.nome AS categoria_nome 
            FROM produtos p 
            JOIN categorias c ON p.id_categoria = c.id_categoria 
            ORDER BY p.id_produto ASC
        `;
        const resultado = await BD.query(query);
        res.render('produtos', { produtos: resultado.rows });
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).send('Erro no banco de dados');
    }
});

module.exports = router;