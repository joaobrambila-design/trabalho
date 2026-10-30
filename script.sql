-- Exclusão das tabelas na ordem correta para evitar conflito de FKs
DROP TABLE IF EXISTS movimentacoes CASCADE;
DROP TABLE IF EXISTS produtos CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Criação das tabelas
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    estoque INT CHECK(estoque >= 0),
    estoque_minimo INT CHECK(estoque_minimo >= 0),
    status BOOLEAN DEFAULT TRUE,
    foto VARCHAR(100),
    descricao VARCHAR(200),
    id_categoria INT NOT NULL,
    CONSTRAINT fk_produtos_categorias FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_admim INT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE,
    senha VARCHAR(10) NOT NULL,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE movimentacoes (
    id_movimentacao SERIAL PRIMARY KEY,
    tipo VARCHAR(2) NOT NULL,
    quantidade INT NOT NULL CHECK(quantidade > 0),
    registro TIMESTAMP NOT NULL,
    descricao VARCHAR(200) NOT NULL,
    id_produto INT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_movimentacoes_produtos FOREIGN KEY (id_produto) REFERENCES produtos(id_produto),
    CONSTRAINT fk_movimentacoes_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Inserção de dados nas tabelas
INSERT INTO categorias (id_categoria, nome, descricao, status) VALUES
(1, 'Periféricos', 'Acessórios e periféricos em geral', TRUE),
(2, 'Celulares', 'Smartphones e dispositivos móveis', TRUE),
(3, 'NotBooks', 'Laptops e computadores portáteis', TRUE);

INSERT INTO usuarios (id_usuario, nome, email, senha, status) VALUES
(1, 'Miguel Llma', 'miguellima@gmail.com', '123456', TRUE),
(2, 'Giovana Barreto', 'giovanabarreto@gmail.com', '123456', TRUE),
(3, 'Julia Emanuely', 'juliaemanuely@gmail.com', '123456', FALSE),
(4, 'Arthur Paiva', 'Arthurpaiva@gmail.com', '123456', TRUE);

INSERT INTO produtos (id_produto, id_categoria, nome, preco, estoque, estoque_minimo, status, foto, descricao) VALUES
(1, 1, 'Capa Magnética Shield', 100000.98, 100, 10, TRUE, 'capa_magnetica.png', 'Proteção reforçada e encaixe preciso para o seu iPhone.'),
(2, 1, 'Película 3D Premium', 89.90, 100, 10, TRUE, 'pelicula_3d.png', 'Vidro resistente, toque preciso e cobertura de ponta a ponta.'),
(3, 3, 'MacBook Air M1', 100000.99, 50, 5, TRUE, 'macbook_air.png', 'Leve, rápido e revisado para acompanhar sua rotina.'),
(4, 2, 'iPhone 18 128 GB', 12149.90, 50, 5, TRUE, 'iphone_18.png', 'Aparelho revisado, com câmeras nítidas e ótimo desempenho.'),
(5, 1, 'Cabo Lightning Original', 168000.50, 100, 10, TRUE, 'cabo_lightning.png', 'Recarga segura e conexão estável para seus dispositivos.');

INSERT INTO movimentacoes (id_produto, id_usuario, tipo, quantidade, registro, descricao) VALUES
(4, 1, 'e', 2, '2026-09-25 08:20:53', 'Entrada - Iphone 18'),
(5, 1, 's', 9, '2026-09-25 08:31:21', 'Saída - Carregador / Cabo Lightning'),
(3, 1, 's', 4, '2026-09-25 08:45:27', 'Saída - MacBook'),
(1, 1, 'e', 25, '2026-09-25 09:07:12', 'Entrada - Capa de celular'),
(2, 1, 's', 6, '2026-09-25 09:15:41', 'Saída - Película de privacidade');