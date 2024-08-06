import { useCallback, useEffect, useRef } from 'react';
import { ScoreCard } from './components/score-card.tsx';
import { Button } from './components/ui/button.tsx';
import { Input } from './components/ui/input.tsx';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover.tsx';
import { useScoreboardState } from './scoreboard-state.tsx';

export const App = () => {
  const teamNameRef = useRef<HTMLInputElement>(null);
  const {teams, add, reset, undo} = useScoreboardState((state) => state);
  const points = Object.values(teams).sort((a,b) => b-a);

  const handleCtrlZ = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key == "z") {
      undo();
    }
  }, [undo]);

  useEffect(() => {
    window.addEventListener("keydown", handleCtrlZ );
    return () => window.removeEventListener("keydown", handleCtrlZ);
  }, [handleCtrlZ]);

  return (
    <>
      <main style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'}}
            className="gap-2 m-2">
        {Object.keys(teams)
          .map((name) =>
            <ScoreCard key={name} teamName={name} rank={points.indexOf(teams[name])+1}
            />)}
      </main>
      <aside>
        <Popover>
          <PopoverTrigger asChild>
            <Button className="absolute top-1 left-1 text-white hover:text-base" variant="ghost">↓</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 flex flex-col gap-2">
            <Input ref={teamNameRef} placeholder={'Team Name'} type="text"/>
            <Button variant="secondary" onClick={() => add(teamNameRef.current!.value)}>Add</Button>
            <Button variant="secondary" onClick={() => undo()}>↩️ Undo</Button>

            <Button variant="secondary" className="mt-10" onClick={() => reset()}>⚠️ Reset</Button>
          </PopoverContent>
        </Popover>
      </aside>
    </>
  );
};
