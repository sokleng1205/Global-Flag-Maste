import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Country, GameMode, Tier, GameState } from './types';
import { countryData } from './data/countries';
import { getCountryFunFact } from './services/gemini';
import { SoundProvider, useSound } from './components/SoundManager';
import FlagDisplay from './components/FlagDisplay';
import { 
  Trophy, Clock, Zap, MapPin, Coins, 
  ArrowRight, RefreshCw, Star, ChevronRight,
  TrendingUp, Award, PlayCircle
} from 'lucide-react';

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
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Helper to get random countries for options
  const getRandomOptions = useCallback((correct: string, type: 'name' | 'capital' | 'currency') => {
    const others = countryData
      .filter(c => {
        if (type === 'name') return c.name !== correct;
        if (type === 'capital') return c.capital !== correct;
        return c.currency !== correct;
      })
      .map(c => (type === 'name' ? c.name : type === 'capital' ? c.capital : c.currency));
    
    const uniqueOthers = Array.from(new Set(others));
    const shuffled = uniqueOthers.sort(() => 0.5 - Math.random()).slice(0, 3);
    return [...shuffled, correct].sort(() => 0.5 - Math.random());
  }, []);

  const loadQuestion = useCallback((level: number) => {
    const candidates = countryData.filter(c => c.difficulty === level);
    // If we run out of unique countries in a level, just grab any from that level
    const randomCountry = candidates[Math.floor(Math.random() * candidates.length)];

    setGameState(prev => ({
      ...prev,
      currentCountry: randomCountry,
      currentTier: Tier.NAME,
    }));

    setOptions(getRandomOptions(randomCountry.name, 'name'));
    setFeedback({ type: null, message: '' });
    setFunFact(null);
  }, [getRandomOptions]);

  const startNewGame = (selectedMode: GameMode) => {
    playClick();
    setMode(selectedMode);
    setTimeLeft(BLITZ_TIME);
    const initialState = {
      currentLevel: 1,
      score: 0,
      questionsInLevel: 0,
      currentCountry: null,
      currentTier: Tier.NAME,
      isGameOver: false,
      history: []
    };
    setGameState(initialState);
    loadQuestion(1);
  };

  // Blitz Timer Logic
  useEffect(() => {
    let timer: any;
    if (mode === GameMode.BLITZ && !gameState.isGameOver && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (mode === GameMode.BLITZ && timeLeft === 0 && !gameState.isGameOver) {
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
    return () => clearInterval(timer);
  }, [mode, timeLeft, gameState.isGameOver]);

  const handleAnswer = async (answer: string) => {
    if (feedback.type || !gameState.currentCountry) return;
    
    const country = gameState.currentCountry;
    let isCorrect = false;
    let points = 0;

    switch (gameState.currentTier) {
      case Tier.NAME:
        isCorrect = answer === country.name;
        points = 10;
        break;
      case Tier.CAPITAL:
        isCorrect = answer === country.capital;
        points = 20;
        break;
      case Tier.CURRENCY:
        isCorrect = answer === country.currency;
        points = 30;
        break;
    }

    if (isCorrect) {
      playCorrect();
      setGameState(prev => ({ ...prev, score: prev.score + points }));
      setFeedback({ type: 'correct', message: 'Masterful!' });

      // Auto-transition to next tier or next country
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

          // After fact, move to next question or next level
          setTimeout(() => {
            const nextQuestionsCount = gameState.questionsInLevel + 1;
            if (nextQuestionsCount >= QUESTIONS_PER_LEVEL) {
              const nextLevel = gameState.currentLevel + 1;
              if (nextLevel > 10) {
                setGameState(prev => ({ ...prev, isGameOver: true }));
              } else {
                playLevelUp();
                setShowLevelUp(true);
                setTimeout(() => setShowLevelUp(false), 2000);
                
                setGameState(prev => ({ 
                  ...prev, 
                  currentLevel: nextLevel, 
                  questionsInLevel: 0 
                }));
                loadQuestion(nextLevel);
              }
            } else {
              setGameState(prev => ({ ...prev, questionsInLevel: nextQuestionsCount }));
              loadQuestion(gameState.currentLevel);
            }
          }, 3500); // Time to read the fact
        }
      }, 1000);
    } else {
      playWrong();
      setFeedback({ 
        type: 'wrong', 
        message: `Incorrect. The ${gameState.currentTier.toLowerCase()} is ${
          gameState.currentTier === Tier.NAME ? country.name : 
          gameState.currentTier === Tier.CAPITAL ? country.capital : country.currency
        }.` 
      });

      // Auto-advance even on failure in professional mode
      setTimeout(() => {
        setGameState(prev => ({ ...prev, questionsInLevel: Math.min(QUESTIONS_PER_LEVEL - 1, prev.questionsInLevel + 1) }));
        loadQuestion(gameState.currentLevel);
      }, 2500);
    }
  };

  const currentTierInfo = useMemo(() => {
    switch (gameState.currentTier) {
      case Tier.NAME: return { label: 'Country Name', icon: <MapPin className="w-5 h-5" />, color: 'blue', bonus: '10 pts' };
      case Tier.CAPITAL: return { label: 'Capital City', icon: <TrendingUp className="w-5 h-5" />, color: 'amber', bonus: '20 pts' };
      case Tier.CURRENCY: return { label: 'Official Currency', icon: <Coins className="w-5 h-5" />, color: 'emerald', bonus: '30 pts' };
    }
  }, [gameState.currentTier]);

  // Initial Menu
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),transparent)] pointer-events-none" />
        
        <div className="z-10 w-full max-w-2xl flex flex-col items-center">
          <div className="mb-8 p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 shadow-2xl shadow-blue-500/10">
            <Zap className="w-20 h-20 text-blue-400" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">GLOBAL</span><br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">FLAG MASTER</span>
          </h1>

          <p className="text-slate-400 max-w-md text-center mb-12 text-lg leading-relaxed">
            Test your global knowledge across <span className="text-white font-bold">10 tiers</span> of difficulty. 
            Identify names, capitals, and currencies to reach Master status.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg">
            <button
              onClick={() => startNewGame(GameMode.NORMAL)}
              className="group relative py-5 px-8 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 rounded-3xl font-bold transition-all transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <PlayCircle className="w-6 h-6 mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                <span>NORMAL MODE</span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium">Standard Experience</span>
              </div>
            </button>
            <button
              onClick={() => startNewGame(GameMode.BLITZ)}
              className="group relative py-5 px-8 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-3xl font-bold transition-all transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center">
                <Clock className="w-6 h-6 mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>BLITZ MODE</span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium">60 Second Sprint</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950">
        <div className="relative mb-12">
          <Award className="w-32 h-32 text-amber-400" />
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full -z-10" />
        </div>
        
        <h2 className="text-5xl font-black mb-4 tracking-tight">EXPERIENCE CONCLUDED</h2>
        
        <div className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-800 mb-10 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold mb-2">Final Performance</p>
            <p className="text-8xl font-black text-white">{gameState.score}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Max Level</p>
              <p className="text-2xl font-bold text-blue-400">{gameState.currentLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Session Type</p>
              <p className="text-2xl font-bold text-purple-400">{mode}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMode(null)}
          className="group flex items-center gap-3 py-5 px-14 bg-white text-slate-950 hover:bg-slate-100 rounded-full font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
        >
          <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
          RESTART PROGRAM
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 p-4 md:p-10">
      {/* Level Up Toast Overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-blue-600 text-white p-8 rounded-[3rem] shadow-2xl shadow-blue-500/40 flex flex-col items-center animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <TrendingUp className="w-16 h-16 mb-4" />
            <h3 className="text-4xl font-black">LEVEL {gameState.currentLevel} REACHED</h3>
            <p className="text-blue-100 uppercase tracking-widest text-sm mt-2">The challenge intensifies</p>
          </div>
        </div>
      )}

      {/* Header Stats */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full mb-12">
        <div className="flex gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md p-3 px-6 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Score</span>
              <span className="text-3xl font-black text-blue-400 leading-none">{gameState.score}</span>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Level</span>
              <span className="text-3xl font-black text-purple-400 leading-none">{gameState.currentLevel}<span className="text-sm text-slate-600 font-normal">/10</span></span>
            </div>
          </div>
        </div>

        {mode === GameMode.BLITZ && (
          <div className={`flex items-center gap-3 text-3xl font-black px-8 py-3 rounded-2xl transition-colors border shadow-xl ${timeLeft < 10 ? 'bg-red-500/20 border-red-500/50 text-red-500 animate-pulse' : 'bg-slate-900 border-slate-800 text-white'}`}>
            <Clock className="w-7 h-7" />
            {timeLeft}s
          </div>
        )}

        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center gap-2 text-slate-400 uppercase tracking-widest font-black text-xs">
            <Award className="w-4 h-4" /> Professional Tier
          </div>
          <h1 className="text-2xl font-black text-slate-200">FLAG MASTER</h1>
        </div>
      </header>

      {/* Main Game Interface */}
      <main className="flex-1 max-w-5xl mx-auto w-full flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Flag Visual Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          {gameState.currentCountry && (
            <div className="w-full animate-in zoom-in duration-500">
              <div className="relative group">
                 <FlagDisplay countryCode={gameState.currentCountry.code} />
                 {/* Decorative background glow */}
                 <div className="absolute -inset-10 bg-blue-600/5 blur-[100px] rounded-full -z-10" />
              </div>
              
              {/* Question Tier Progress */}
              <div className="mt-8 flex gap-2 w-full max-w-sm mx-auto">
                {[Tier.NAME, Tier.CAPITAL, Tier.CURRENCY].map((t) => (
                  <div key={t} className="flex-1 h-2 relative">
                    <div className="absolute inset-0 bg-slate-800 rounded-full" />
                    <div 
                      className={`absolute inset-0 rounded-full transition-all duration-700 ${
                        gameState.currentTier === t ? 'bg-blue-500 shadow-lg shadow-blue-500/50 w-full animate-pulse' : 
                        (t === Tier.NAME || (t === Tier.CAPITAL && gameState.currentTier === Tier.CURRENCY)) ? 'bg-emerald-500 w-full' : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Interaction Section */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {gameState.currentCountry && (
            <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
              {/* Tier Heading */}
              <div className="mb-6">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    {currentTierInfo?.icon}
                  </div>
                  <span className="text-sm font-black uppercase tracking-[0.2em]">{currentTierInfo?.label}</span>
                </div>
                <h2 className="text-3xl font-black text-white">Identify the correctly associated detail.</h2>
                <div className="mt-2 inline-flex items-center px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Correct Answer: <span className="ml-2 text-emerald-400">+{currentTierInfo?.bonus}</span>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-4">
                {options.map((opt, i) => {
                   const isCorrectOpt = opt === (
                      gameState.currentTier === Tier.NAME ? gameState.currentCountry?.name : 
                      gameState.currentTier === Tier.CAPITAL ? gameState.currentCountry?.capital : 
                      gameState.currentCountry?.currency
                   );
                   const isWrongSelected = feedback.type === 'wrong' && opt !== feedback.message.split('is ')[1] && !isCorrectOpt;

                   return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={!!feedback.type}
                      className={`
                        group relative w-full text-left overflow-hidden py-5 px-8 rounded-3xl border transition-all duration-300
                        ${feedback.type === 'correct' && isCorrectOpt
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-100' 
                          : feedback.type === 'wrong' && isCorrectOpt
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-100'
                            : feedback.type === 'wrong' && !isCorrectOpt
                              ? 'bg-red-500/5 border-red-500/20 text-red-300/40 opacity-50'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50 hover:-translate-x-1 text-slate-200'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className="font-bold text-lg tracking-tight">{opt}</span>
                        <ChevronRight className={`w-5 h-5 transition-transform ${feedback.type ? 'opacity-0' : 'group-hover:translate-x-1 opacity-40'}`} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Facts Toast */}
              <div className="min-h-[100px] mt-8">
                {feedback.type && (
                  <div className={`flex items-center gap-3 font-black text-xl mb-4 animate-in slide-in-from-top-4 duration-300 ${feedback.type === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {feedback.type === 'correct' ? <Zap className="w-6 h-6 fill-emerald-400" /> : <RefreshCw className="w-6 h-6" />}
                    {feedback.message}
                  </div>
                )}
                
                {funFact && (
                  <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-3xl animate-in slide-in-from-bottom-4 duration-500 shadow-2xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Cultural Discovery</span>
                    </div>
                    <p className="text-slate-300 italic text-sm leading-relaxed">&ldquo;{funFact}&rdquo;</p>
                  </div>
                )}
                
                {isLoadingFact && (
                  <div className="flex items-center gap-3 text-slate-500 animate-pulse font-medium text-sm">
                    <div className="w-4 h-4 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
                    Retrieving geographical intelligence...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Level Progress Footer */}
      <footer className="mt-auto max-w-6xl mx-auto w-full pt-10 flex flex-col items-center">
        <div className="w-full max-w-md bg-slate-900/50 rounded-full h-1.5 p-0.5 border border-slate-800 mb-4">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${(gameState.questionsInLevel / QUESTIONS_PER_LEVEL) * 100}%` }}
            />
        </div>
        <div className="flex items-center gap-8">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Session Progress: {gameState.questionsInLevel}/{QUESTIONS_PER_LEVEL} to level up
          </div>
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