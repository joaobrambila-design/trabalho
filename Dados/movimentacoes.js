const express = require('express');
const router = express.Router();
const BD = require('./db');

// Listar todos os participantes
router.get('/', async (req, res) => {
    try {
        const resultado = await BD.query('SELECT * FROM participantes ORDER BY id_participante ASC');
        res.render('participantes', { participantes: resultado.rows });
    } catch (err) {
        console.error('Erro ao procurar participantes:', err);
        res.status(500).send('Erro na base de dados');
    }
});

module.exports = router;