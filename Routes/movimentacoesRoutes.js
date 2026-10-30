const express = require('express');
const router = express.Router();

// Listar movimentações de estoque (entradas e saídas)
router.get('/', (req, res) => {
    res.send('Página de Movimentações de Estoque');
});

module.exports = router;