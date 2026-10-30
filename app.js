const express = require('express');
const path = require('path');
const session = require('express-session');
const BD = require('./db');

const app = express();
const PORT = 3000;

// Configurações do EJS e Arquivos Estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'Public')));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de Sessão (Guarda o login do utilizador)
app.use(session({
    secret: 'renovacell_chave_segura_2026',
    resave: false,
    saveUninitialized: true
}));

// Middleware para disponibilizar os dados do utilizador logado em todas as views EJS
app.use((req, res, next) => {
    res.locals.usuarioLogado = req.session.usuario || null;
    next();
});

// Middleware para proibir usuários comuns de acessar telas de Admin
function verificarAdmin(req, res, next) {
    if (req.session.usuario && req.session.usuario.id_admin !== null) {
        return next();
    }
    // Se não for admin, redireciona para a página de produtos
    res.redirect('/produtos');
}

// ==========================================
// ROTAS DO SISTEMA
// ==========================================

// Página Inicial (Acesso Público)
app.get('/', (req, res) => {
    res.render('index');
});

// Página de Produtos (Acesso Público para Todos)
app.get('/produtos', async (req, res) => {
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

// Página de Categorias (EXCLUSIVO ADMIN)
app.get('/categorias', verificarAdmin, async (req, res) => {
    try {
        const resultado = await BD.query('SELECT * FROM categorias ORDER BY id_categoria ASC');
        res.render('categorias', { categorias: resultado.rows });
    } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        res.status(500).send('Erro no banco de dados');
    }
});

// Página de Usuários (EXCLUSIVO ADMIN)
app.get('/usuarios', verificarAdmin, async (req, res) => {
    try {
        const resultado = await BD.query('SELECT id_usuario, nome, email, status, id_admin FROM usuarios ORDER BY id_usuario ASC');
        res.render('usuarios', { usuarios: resultado.rows });
    } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).send('Erro no banco de dados');
    }
});

// Página de Movimentações (EXCLUSIVO ADMIN)
app.get('/movimentacoes', verificarAdmin, async (req, res) => {
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

// ==========================================
// LOGIN, REGISTRO E LOGOUT
// ==========================================

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const resultado = await BD.query('SELECT * FROM usuarios WHERE email = $1 AND senha = $2', [email, senha]);
        
        if (resultado.rows.length > 0) {
            const usuario = resultado.rows[0];
            req.session.usuario = usuario; // Salva o utilizador na sessão

            // Se for Admin, vai para a área de movimentações
            if (usuario.id_admin !== null) {
                res.redirect('/movimentacoes');
            } else {
                // Se for Usuário Comum, vai apenas para os produtos
                res.redirect('/produtos');
            }
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error('Erro no login:', err);
        res.redirect('/login');
    }
});

app.get('/registro', (req, res) => {
    res.render('registro');
});

app.post('/registro', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        await BD.query('INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)', [nome, email, senha]);
        res.redirect('/login');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.redirect('/registro');
    }
});

// Rota de Logout (Sair da conta)
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor ativo em http://localhost:${PORT}`);
});

// Página Inicial (Landing Page - Acessível para todos)
app.get('/', (req, res) => {
    res.render('index');
});