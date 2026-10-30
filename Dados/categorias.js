const express = require('express');
const router = express.Router();
const BD = require('./db');

// Listar categorias
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query('SELECT * FROM categorias ORDER BY id_categoria ASC');
        res.render('categorias', { categorias: resultado.rows });
    } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        res.status(500).send('Erro no banco de dados');
    }
});

module.exports = router;