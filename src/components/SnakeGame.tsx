import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!gameOver) setIsPaused(prev => !prev);
          else resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, INITIAL_SPEED - Math.min(score / 5, 100));
    return () => clearInterval(gameLoop);
  }, [direction, food, isPaused, gameOver, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = i === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#39ff14';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#39ff14';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="neon-border-blue rounded-lg cursor-none"
        />
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-lg">
            <h2 className={`text-4xl font-bold mb-4 ${gameOver ? 'text-neon-pink neon-text-pink' : 'text-neon-blue neon-text-blue'}`}>
              {gameOver ? 'GAME OVER' : 'PAUSED'}
            </h2>
            <p className="text-white/70 mb-6">Score: {score}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={gameOver ? resetGame : () => setIsPaused(false)}
              className={`px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all
                ${gameOver ? 'neon-border-pink text-neon-pink' : 'neon-border-blue text-neon-blue'}`}
            >
              {gameOver ? 'Try Again' : 'Resume'}
            </motion.button>
            <p className="mt-4 text-xs text-white/40 uppercase tracking-widest">Press Space to {gameOver ? 'Restart' : 'Toggle'}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between w-full px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-white/40">Score</span>
          <span className="text-2xl font-mono text-neon-green neon-text-green">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-white/40">Status</span>
          <span className={`text-sm font-bold uppercase ${isPaused ? 'text-neon-pink' : 'text-neon-blue'}`}>
            {isPaused ? 'Standby' : 'Active'}
          </span>
        </div>
      </div>
    </div>
  );
};
