import { useCallback, useEffect, useRef } from 'react';
import { ScoreCard } from './components/score-card.tsx';
import { Button } from './components/ui/button.tsx';
import { Input } from './components/ui/input.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover.tsx';
import { useScoreboardState } from './scoreboard-state.tsx';

export const App = () => {
  const teamNameRef = useRef<HTMLInputElement>(null);
  const {
    teams,
    add,
    reset,
    undo,
    awardPoints,
    punishPoints,
    setAwardPoints,
    setPunishPoints,
  } = useScoreboardState((state) => state);
  const points = Object.values(teams)
    .sort((a, b) => b - a);

  const handleCtrlZ = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key == 'z') {
      undo();
    }
  }, [undo]);

  useEffect(() => {
    window.addEventListener('keydown', handleCtrlZ);
    return () => window.removeEventListener('keydown', handleCtrlZ);
  }, [handleCtrlZ]);

  return (
    <>
      <main style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'}}
            className="gap-2 m-2 justify-center">
        {Object.keys(teams)
          .map((name) =>
            <ScoreCard key={name} teamName={name} rank={points.indexOf(teams[name]) + 1}
            />)}
      </main>
      <aside>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="absolute top-1 left-1 text-white hover:text-base" variant="ghost">↓</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 flex flex-col gap-2">
            <Input ref={teamNameRef} placeholder={'Team Name'} type="text"/>
            <Button variant="secondary" onClick={() => add(teamNameRef.current!.value)}>Add new team</Button>
            <Button variant="secondary" onClick={() => undo()}>↩️ Undo last action</Button>
            <label htmlFor="award-points">Points for correct answers</label>
            <Input id="award-points" type="number" value={awardPoints} onChange={(event) => setAwardPoints(Number(event.target.value))}/>
            <label htmlFor="punish-points">Points for wrong answers</label>
            <Input id="punish-points" type="number" value={punishPoints} onChange={(event) => setPunishPoints(Number(event.target.value))}/>

            <Button variant="secondary" className="mt-10" onClick={() => reset()}>⚠️ Reset teams and history</Button>
          </PopoverContent>
        </Popover>
      </aside>
    </>
  );
};
