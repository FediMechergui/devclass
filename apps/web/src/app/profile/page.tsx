import fs from 'fs';
import path from 'path';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const archetypesPath = path.join(process.cwd(), '../../data/archetypes.json');
  let archetypes = [];
  try {
    const data = fs.readFileSync(archetypesPath, 'utf8');
    archetypes = JSON.parse(data);
  } catch (error) {
    console.error("Failed to load archetypes", error);
  }

  // Mocking the result of the scoring engine for the MVP demo
  const mockUserScores = {
    ANL: 85, CRT: 75, CRE: 40, DOM: 80, FOC: 65, CUR: 60, INT: 85, REG: 70, COM: 60
  };

  // Find the Architect (id: architect) since the scores match closely
  const primaryArchetype = archetypes.find((a: any) => a.id === 'architect') || archetypes[0];

  return (
    <main className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden">
      <ProfileClient 
        userScores={mockUserScores} 
        primaryArchetype={primaryArchetype} 
      />
    </main>
  );
}
