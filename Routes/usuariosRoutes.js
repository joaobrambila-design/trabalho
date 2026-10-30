const express = require('express');
const router = express.Router();

// Listar utilizadores
router.get('/', (req, res) => {
    res.send('Página de Usuários');
});

module.exports = router;