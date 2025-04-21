// Definindo as interfaces para os tipos
interface Position {
    row: number;
    col: number;
}

interface QueueItem extends Position {
    path: Position[];
}

// Mapeamento de caracteres para emojis (apenas para exibição)
const CHAR_TO_EMOJI: Record<string, string> = {
    '#': '🚧',       // Parede
    'S': '🏃‍♂️➡️',   // Início
    'E': '🚪',       // Saída
    '.': '🛣️'        // Caminho
};

// Matriz padrão que representa o labirinto
let maze: string[][] = [
    ['#', 'S', '.', '.'],
    ['#', '#', '.', '#'],
    ['.', '.', '.', '#'],
    ['.', '#', 'E', '#']
];

// Encontra posições iniciais e finais automaticamente
let startPos: Position = { row: -1, col: -1 };
let endPos: Position = { row: -1, col: -1 };

// Inicializa posições de início e fim
function findStartAndEnd(): void {
    startPos = { row: -1, col: -1 };
    endPos = { row: -1, col: -1 };

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 'S') {
                startPos = { row, col };
            } else if (maze[row][col] === 'E') {
                endPos = { row, col };
            }
        }
    }

    // Verificação de segurança
    if (startPos.row === -1 || endPos.row === -1) {
        console.error("Início ou fim não encontrados no labirinto");
    }
}

// Direções para movimento (cima, direita, baixo, esquerda)
const directions: Position[] = [
    { row: -1, col: 0 },  // Cima
    { row: 0, col: 1 },   // Direita
    { row: 1, col: 0 },   // Baixo
    { row: 0, col: -1 }   // Esquerda
];

/**
 * Verifica se uma posição é válida no labirinto
 */
function isValidPosition(row: number, col: number): boolean {
    return (
        row >= 0 &&
        row < maze.length &&
        col >= 0 &&
        col < maze[0].length &&
        (maze[row][col] === '.' || maze[row][col] === 'E' || maze[row][col] === 'S')
    );
}

/**
 * Algoritmo de Busca em Largura (BFS) para encontrar o caminho mais curto
 */
function findShortestPath(): Position[] {
    // Verificação de segurança
    if (startPos.row === -1 || endPos.row === -1) {
        console.error("Início ou fim não encontrados no labirinto");
        return [];
    }

    // Matriz para rastrear posições visitadas
    const visited: boolean[][] = Array(maze.length)
        .fill(null)
        .map(() => Array(maze[0].length).fill(false));

    // Fila para o BFS
    const queue: QueueItem[] = [];

    // Marcar a posição inicial como visitada
    visited[startPos.row][startPos.col] = true;

    // Adicionar a posição inicial à fila
    queue.push({
        row: startPos.row,
        col: startPos.col,
        path: [{ row: startPos.row, col: startPos.col }]
    });

    // Enquanto houver elementos na fila
    while (queue.length > 0) {
        // Pegar o primeiro elemento da fila
        const current = queue.shift()!;

        // Se chegamos ao final, retornar o caminho
        if (current.row === endPos.row && current.col === endPos.col) {
            return current.path;
        }

        // Verificar todas as direções possíveis
        for (const dir of directions) {
            const newRow = current.row + dir.row;
            const newCol = current.col + dir.col;

            // Se a nova posição é válida e não foi visitada
            if (isValidPosition(newRow, newCol) && !visited[newRow][newCol]) {
                // Marcar como visitada
                visited[newRow][newCol] = true;

                // Criar o novo caminho
                const newPath = [...current.path, { row: newRow, col: newCol }];

                // Adicionar à fila
                queue.push({ row: newRow, col: newCol, path: newPath });
            }
        }
    }

    // Nenhum caminho encontrado
    return [];
}

/**
 * Converte a matriz de caracteres para emojis (para exibição)
 */
function convertMazeToEmojis(): string[][] {
    return maze.map(row =>
        row.map(cell => CHAR_TO_EMOJI[cell] || cell)
    );
}

/**
 * Renderiza o labirinto no container HTML
 */
function renderMaze(): void {
    const mazeContainer = document.getElementById('maze-container');
    if (!mazeContainer) {
        console.error("Elemento 'maze-container' não encontrado");
        return;
    }

    mazeContainer.innerHTML = '';
    const emojiMaze = convertMazeToEmojis();

    // Adicionar classe grid para estabelecer o grid layout corretamente
    mazeContainer.style.display = 'grid';
    mazeContainer.style.gridTemplateColumns = `repeat(${maze[0].length}, 1fr)`;

    // Loop pelas linhas e colunas e criar os elementos HTML
    for (let row = 0; row < emojiMaze.length; row++) {
        for (let col = 0; col < emojiMaze[row].length; col++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';
            cell.textContent = emojiMaze[row][col];
            cell.dataset.row = row.toString();
            cell.dataset.col = col.toString();
            mazeContainer.appendChild(cell);
        }
    }
}

/**
 * Destaca o caminho encontrado no labirinto
 */
function highlightPath(path: Position[]): void {
    // Limpar células destacadas
    document.querySelectorAll('.maze-cell').forEach(cell => {
        cell.classList.remove('path');
        cell.classList.remove('current');
    });

    // Destacar o novo caminho
    path.forEach((pos) => {
        const cell = document.querySelector(`.maze-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
        if (cell) {
            cell.classList.add('path');
        }
    });
}

/**
 * Anima o caminho no labirinto, célula por célula
 */
function animatePath(path: Position[]): void {
    // Limpar células destacadas
    document.querySelectorAll('.maze-cell').forEach(cell => {
        cell.classList.remove('path');
        cell.classList.remove('current');
    });

    // Se não houver caminho, não fazer nada
    if (path.length === 0) return;

    let index = 0;

    // Função para animar uma célula por vez
    const animateStep = () => {
        if (index > 0) {
            const prevCell = document.querySelector(
                `.maze-cell[data-row="${path[index - 1].row}"][data-col="${path[index - 1].col}"]`
            );
            if (prevCell) {
                prevCell.classList.add('path');
                prevCell.classList.remove('current');
            }
        }

        if (index < path.length) {
            const cell = document.querySelector(
                `.maze-cell[data-row="${path[index].row}"][data-col="${path[index].col}"]`
            );
            if (cell) {
                cell.classList.add('current');
            }
            index++;
            setTimeout(animateStep, 500);
        }
    };

    // Iniciar a animação
    animateStep();
}

/**
 * Formata o caminho para exibição na interface no formato solicitado
 */
function formatPathOutput(path: Position[]): string {
    return path.map(pos => `(${pos.row}, ${pos.col})`).join(', ');
}

/**
 * Processa o input do usuário para criar um novo labirinto
 */
function processMazeInput(): void {
    const input = document.getElementById('maze-input') as HTMLTextAreaElement;
    if (!input || !input.value.trim()) return;

    try {
        // Tentativa de avaliar o input como uma matriz JavaScript
        // Aviso: eval() é perigoso em aplicações reais
        const mazeValue = eval(`(${input.value})`);

        // Verificar se é uma matriz válida
        if (Array.isArray(mazeValue) && mazeValue.length > 0 && Array.isArray(mazeValue[0])) {
            maze = mazeValue;
            findStartAndEnd();
            renderMaze();

            const pathResult = document.getElementById('path-result');
            if (pathResult) {
                pathResult.textContent = 'Clique em "Resolver Labirinto" para encontrar o caminho.';
            }
        } else {
            alert('Formato de matriz inválido! Use o formato do exemplo.');
        }
    } catch (error) {
        console.error("Erro ao processar matriz:", error);
        alert('Erro ao processar a matriz. Verifique o formato.');
    }
}

// Função principal que será executada quando o DOM estiver carregado
function init(): void {
    console.log("Inicializando aplicação...");

    // Encontrar posições iniciais e finais no labirinto
    findStartAndEnd();

    // Renderizar o labirinto
    renderMaze();

    // Event listener para o botão de resolver
    const solveBtn = document.getElementById('solve-btn');
    if (solveBtn) {
        solveBtn.onclick = function () {
            console.log("Botão resolver clicado");
            const path = findShortestPath();
            const pathResult = document.getElementById('path-result');

            if (!pathResult) return;

            if (path.length > 0) {
                highlightPath(path);
                pathResult.textContent = formatPathOutput(path);
            } else {
                pathResult.textContent = 'Nenhum caminho encontrado!';
            }
        };
    } else {
        console.error("Botão 'solve-btn' não encontrado");
    }

    // Event listener para o botão de limpar
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
        clearBtn.onclick = function () {
            console.log("Botão limpar clicado");
            document.querySelectorAll('.maze-cell').forEach(cell => {
                cell.classList.remove('path');
                cell.classList.remove('current');
            });

            const pathResult = document.getElementById('path-result');
            if (pathResult) {
                pathResult.textContent = 'Clique em "Resolver Labirinto" para encontrar o caminho.';
            }
        };
    } else {
        console.error("Botão 'clear-btn' não encontrado");
    }

    // Event listener para o botão de animar
    const animateBtn = document.getElementById('animate-btn');
    if (animateBtn) {
        animateBtn.onclick = function () {
            console.log("Botão animar clicado");
            const path = findShortestPath();
            const pathResult = document.getElementById('path-result');

            if (!pathResult) return;

            if (path.length > 0) {
                animatePath(path);
                pathResult.textContent = formatPathOutput(path);
            } else {
                pathResult.textContent = 'Nenhum caminho encontrado!';
            }
        };
    } else {
        console.error("Botão 'animate-btn' não encontrado");
    }

    // Event listener para o botão de reiniciar - atenção ao elemento <a> em vez de <button>
    const resetMazeBtn = document.getElementById('reset-maze-btn');
    if (resetMazeBtn) {
        resetMazeBtn.onclick = function (e) {
            console.log("Botão reiniciar clicado");
            e.preventDefault();
            // Resetar para a matriz padrão
            maze = [
                ['#', 'S', '.', '.'],
                ['#', '#', '.', '#'],
                ['.', '.', '.', '#'],
                ['.', '#', 'E', '#']
            ];
            findStartAndEnd();
            renderMaze();

            const pathResult = document.getElementById('path-result');
            if (pathResult) {
                pathResult.textContent = 'Clique em "Resolver Labirinto" para encontrar o caminho.';
            }

            // Limpar o input se existir
            const mazeInput = document.getElementById('maze-input') as HTMLTextAreaElement;
            if (mazeInput) {
                mazeInput.value = '';
            }

            return false;
        };
    } else {
        console.error("Botão 'reset-maze-btn' não encontrado");
    }

    // Event listener para o campo de entrada da matriz
    const mazeInput = document.getElementById('maze-input') as HTMLTextAreaElement;
    if (mazeInput) {
        // Usar 'change' em vez de 'blur' para melhor comportamento
        mazeInput.addEventListener('change', processMazeInput);
    } else {
        console.error("Campo 'maze-input' não encontrado");
    }
}

// Garantir que tudo seja carregado antes de inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}