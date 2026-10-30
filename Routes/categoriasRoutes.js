const express = require('express');
const router = express.Router();

// Listar categorias
router.get('/', (req, res) => {
    res.send('Página de Categorias');
});

module.exports = router;