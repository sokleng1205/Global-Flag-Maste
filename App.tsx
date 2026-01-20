
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Country, GameMode, Tier, GameState } from './types';
import { countryData } from './data/countries';
import { getCountryFunFact } from './services/gemini';
import { SoundProvider, useSound } from './components/SoundManager';
import FlagDisplay from './components/FlagDisplay';
import { Trophy, Clock, Zap, MapPin, Coins, ArrowRight, RefreshCw, Star } from 'lucide-react';

const QUESTIONS_PER_LEVEL = 5;
const BLITZ_TIME = 60;

const GameContent: React.FC = () => {
  const { playCorrect, playWrong, playLevelUp, playClick } = useSound();
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    questionsInLevel: 0,
    currentCountry: null,
    currentTier: Tier.NAME,
    isGameOver: false,
    history: []
  });

  const [mode, setMode] = useState<GameMode | null>(null);
  const [timeLeft, setTimeLeft] = useState(BLITZ_TIME);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null, message: string }>({ type: null, message: '' });
  const [funFact, setFunFact] = useState<string | null>(null);
  const [isLoadingFact, setIsLoadingFact] = useState(false);

  // Helper to get random countries for options
  const getRandomOptions = useCallback((correct: string, type: 'name' | 'capital' | 'currency') => {
    const others = countryData
      .filter(c => {
        if (type === 'name') return c.name !== correct;
        if (type === 'capital') return c.capital !== correct;
        return c.currency !== correct;
      })
      .map(c => (type === 'name' ? c.name : type === 'capital' ? c.capital : c.currency));
    
    // De-duplicate if currencies are same across countries
    const uniqueOthers = Array.from(new Set(others));
    const shuffled = uniqueOthers.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffled, correct].sort(() => 0.5 - Math.random());
  }, []);

  const nextQuestion = useCallback((levelOverride?: number) => {
    const targetLevel = levelOverride || gameState.currentLevel;
    const candidates = countryData.filter(c => c.difficulty === targetLevel);
    const randomCountry = candidates[Math.floor(Math.random() * candidates.length)];

    setGameState(prev => ({
      ...prev,
      currentCountry: randomCountry,
      currentTier: Tier.NAME,
    }));

    setOptions(getRandomOptions(randomCountry.name, 'name'));
    setFeedback({ type: null, message: '' });
    setFunFact(null);
  }, [gameState.currentLevel, getRandomOptions]);

  const startNewGame = (selectedMode: GameMode) => {
    setMode(selectedMode);
    setTimeLeft(BLITZ_TIME);
    setGameState({
      currentLevel: 1,
      score: 0,
      questionsInLevel: 0,
      currentCountry: null,
      currentTier: Tier.NAME,
      isGameOver: false,
      history: []
    });
    // Trigger first question after state reset
    setTimeout(() => nextQuestion(1), 0);
    playClick();
  };

  // Blitz Timer
  useEffect(() => {
    let timer: any;
    if (mode === GameMode.BLITZ && !gameState.isGameOver && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
    return () => clearInterval(timer);
  }, [mode, timeLeft, gameState.isGameOver]);

  const handleAnswer = async (answer: string) => {
    if (feedback.type) return; // Prevent double clicks
    
    const country = gameState.currentCountry!;
    let isCorrect = false;
    let points = 0;

    if (gameState.currentTier === Tier.NAME) {
      isCorrect = answer === country.name;
      points = 10;
    } else if (gameState.currentTier === Tier.CAPITAL) {
      isCorrect = answer === country.capital;
      points = 20;
    } else {
      isCorrect = answer === country.currency;
      points = 30;
    }

    if (isCorrect) {
      playCorrect();
      setGameState(prev => ({ ...prev, score: prev.score + points }));
      setFeedback({ type: 'correct', message: 'Correct!' });

      // Move to next tier or next country
      setTimeout(async () => {
        if (gameState.currentTier === Tier.NAME) {
          setGameState(prev => ({ ...prev, currentTier: Tier.CAPITAL }));
          setOptions(getRandomOptions(country.capital, 'capital'));
          setFeedback({ type: null, message: '' });
        } else if (gameState.currentTier === Tier.CAPITAL) {
          setGameState(prev => ({ ...prev, currentTier: Tier.CURRENCY }));
          setOptions(getRandomOptions(country.currency, 'currency'));
          setFeedback({ type: null, message: '' });
        } else {
          // Finished all 3 tiers for this country
          setIsLoadingFact(true);
          const fact = await getCountryFunFact(country.name);
          setFunFact(fact);
          setIsLoadingFact(false);

          setTimeout(() => {
            const nextQuestionsCount = gameState.questionsInLevel + 1;
            if (nextQuestionsCount >= QUESTIONS_PER_LEVEL) {
              const nextLevel = gameState.currentLevel + 1;
              if (nextLevel > 10) {
                setGameState(prev => ({ ...prev, isGameOver: true }));
              } else {
                playLevelUp();
                setGameState(prev => ({ 
                  ...prev, 
                  currentLevel: nextLevel, 
                  questionsInLevel: 0 
                }));
                nextQuestion(nextLevel);
              }
            } else {
              setGameState(prev => ({ ...prev, questionsInLevel: nextQuestionsCount }));
              nextQuestion();
            }
          }, 4000); // Give time to read the fun fact
        }
      }, 800);
    } else {
      playWrong();
      setFeedback({ 
        type: 'wrong', 
        message: `Oops! The correct answer was ${
          gameState.currentTier === Tier.NAME ? country.name : 
          gameState.currentTier === Tier.CAPITAL ? country.capital : country.currency
        }` 
      });

      // Auto next country on fail (or game over in Blitz?)
      setTimeout(() => {
        if (mode === GameMode.BLITZ) {
          // In blitz, we keep going but lose the chance for more points on this country
          nextQuestion();
        } else {
          // In Normal, we just move to next country
          nextQuestion();
        }
      }, 2000);
    }
  };

  const currentTierInfo = useMemo(() => {
    switch (gameState.currentTier) {
      case Tier.NAME: return { label: 'Identify Country', icon: <MapPin className="w-5 h-5" />, color: 'blue' };
      case Tier.CAPITAL: return { label: 'Identify Capital', icon: <Trophy className="w-5 h-5" />, color: 'amber' };
      case Tier.CURRENCY: return { label: 'Identify Currency', icon: <Coins className="w-5 h-5" />, color: 'emerald' };
    }
  }, [gameState.currentTier]);

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-12 animate-pulse">
          <Zap className="w-24 h-24 text-blue-400 mx-auto" />
        </div>
        <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          GLOBAL FLAG MASTER
        </h1>
        <p className="text-slate-400 max-w-lg mb-12 text-lg leading-relaxed">
          Master the flags of the world through our adaptive three-tier system. 
          Identify the name, capital, and currency as you progress from Level 1 to Level 10.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
          <button
            onClick={() => startNewGame(GameMode.NORMAL)}
            className="flex-1 py-4 px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40"
          >
            NORMAL MODE
          </button>
          <button
            onClick={() => startNewGame(GameMode.BLITZ)}
            className="flex-1 py-4 px-8 bg-purple-600 hover:bg-purple-500 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/40"
          >
            BLITZ BLITZ
          </button>
        </div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Trophy className="w-24 h-24 text-amber-400 mb-8" />
        <h2 className="text-5xl font-black mb-4 uppercase">Mission Complete</h2>
        <div className="bg-white/5 backdrop-blur-md p-10 rounded-3xl border border-white/10 mb-8 w-full max-w-sm">
          <p className="text-slate-400 uppercase tracking-widest mb-2">Final Score</p>
          <p className="text-7xl font-black text-white">{gameState.score}</p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">LEVEL REACHED</p>
              <p className="font-bold text-blue-400">{gameState.currentLevel}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-xs text-slate-500">MODE</p>
              <p className="font-bold text-purple-400">{mode}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setMode(null)}
          className="py-4 px-12 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" /> REPLAY
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full">
      {/* Header Stats */}
      <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-3 px-6 rounded-2xl border border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Score</span>
            <span className="text-2xl font-black text-blue-400">{gameState.score}</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Level</span>
            <span className="text-2xl font-black text-purple-400">{gameState.currentLevel}/10</span>
          </div>
        </div>

        {mode === GameMode.BLITZ && (
          <div className={`flex items-center gap-2 text-2xl font-black px-6 py-3 rounded-2xl ${timeLeft < 10 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-white'}`}>
            <Clock className="w-6 h-6" />
            {timeLeft}s
          </div>
        )}

        <div className="hidden sm:block text-right">
          <h1 className="text-xl font-black text-slate-200">FLAG MASTER</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest">{mode} MODE</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Tier Progress Indicator */}
        <div className="flex gap-4 w-full max-w-xs mb-2">
          {[Tier.NAME, Tier.CAPITAL, Tier.CURRENCY].map((t) => (
            <div 
              key={t}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                gameState.currentTier === t ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 
                (t === Tier.NAME || (t === Tier.CAPITAL && gameState.currentTier === Tier.CURRENCY)) ? 'bg-emerald-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {gameState.currentCountry && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FlagDisplay countryCode={gameState.currentCountry.code} />
            
            <div className="mt-8 mb-4 flex items-center gap-2 text-slate-300 font-semibold uppercase tracking-widest text-sm">
              {currentTierInfo?.icon}
              {currentTierInfo?.label}
            </div>

            {/* Fun Fact Toast */}
            {funFact && (
              <div className="mb-6 max-w-xl p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-100 text-center animate-bounce-in">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Fun Fact</span>
                </div>
                {funFact}
              </div>
            )}
            {isLoadingFact && (
              <div className="mb-6 flex items-center gap-2 text-slate-400 animate-pulse italic">
                Gathering facts from history...
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mt-4">
              {options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback.type}
                  className={`
                    group relative overflow-hidden py-4 px-6 rounded-2xl border transition-all duration-300 transform
                    ${feedback.type === 'correct' && opt === (gameState.currentTier === Tier.NAME ? gameState.currentCountry?.name : gameState.currentTier === Tier.CAPITAL ? gameState.currentCountry?.capital : gameState.currentCountry?.currency) 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100 scale-105' 
                      : feedback.type === 'wrong' && opt === feedback.message.split('was ')[1]
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100'
                        : feedback.type === 'wrong' && opt !== feedback.message.split('was ')[1]
                          ? 'bg-red-500/10 border-red-500/30 text-red-300 opacity-50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 active:scale-95 text-white'
                    }
                  `}
                >
                  <span className="relative z-10 font-bold text-lg">{opt}</span>
                  {/* Subtle hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              ))}
            </div>

            {feedback.type && (
              <div className={`mt-8 font-bold text-xl flex items-center gap-2 animate-bounce ${feedback.type === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                {feedback.type === 'correct' ? <Zap className="w-6 h-6 fill-emerald-400" /> : null}
                {feedback.message}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Progress Footer */}
      <footer className="mt-8 flex justify-center">
        <div className="flex gap-1">
          {Array.from({ length: QUESTIONS_PER_LEVEL }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                i < gameState.questionsInLevel ? 'bg-blue-500 scale-110' : 
                i === gameState.questionsInLevel ? 'bg-blue-500/30 animate-pulse' : 'bg-white/5'
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SoundProvider>
      <GameContent />
    </SoundProvider>
  );
};

export default App;
