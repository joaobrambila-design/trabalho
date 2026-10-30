const express = require('express');
const router = express.Router();

// Listar produtos
router.get('/', (req, res) => {
    res.send('Página de Produtos');
});

module.exports = router;