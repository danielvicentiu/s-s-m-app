'use client';
import { useState } from 'react';

interface Question {
  text: string;
  options: string[];
  correct: number;
}

export default function TrainingTest({ 
  type, 
  questions, 
  onFinished 
}: { 
  type: 'SSM' | 'PSI', 
  questions: Question[], 
  onFinished: (score: number) => void 
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers, optionIdx];
    if (currentIdx < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIdx(currentIdx + 1);
    } else {
      const correctOnes = newAnswers.filter((ans, i) => ans === questions[i].correct).length;
      const finalScore = Math.round((correctOnes / questions.length) * 10);
      onFinished(finalScore);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <span className={`px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${type === 'SSM' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
          Testare {type}
        </span>
        <div className="text-slate-500 text-xs font-bold uppercase">Progres: {currentIdx + 1} / {questions.length}</div>
      </div>
      
      <div className="mb-10">
        <h3 className="text-2xl font-bold text-white leading-tight">{questions[currentIdx].text}</h3>
      </div>
      
      <div className="space-y-4">
        {questions[currentIdx].options.map((opt, i) => (
          <button 
            key={i} 
            onClick={() => handleAnswer(i)}
            className="w-full p-5 text-left bg-slate-800/50 hover:bg-slate-700 hover:border-teal-500 border border-slate-700 rounded-2xl transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-black group-hover:bg-teal-500 group-hover:text-black transition-colors">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-slate-200 font-medium">{opt}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}