import fs from 'fs';
import path from 'path';
import QuizClient from './QuizClient';

export default async function QuizPage() {
  const questionsPath = path.join(process.cwd(), '../../data/questions.json');
  let questions = [];
  try {
    const data = fs.readFileSync(questionsPath, 'utf8');
    questions = JSON.parse(data);
  } catch (error) {
    console.error("Failed to load questions", error);
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl flex-1 flex flex-col">
        <QuizClient initialQuestions={questions} />
      </div>
    </main>
  );
}
