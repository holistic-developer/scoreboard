import { useScoreboardState } from '../scoreboard-state.tsx';
import { Button } from './ui/button.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card.tsx';

export const ScoreCard: React.FC<{ teamName: string, rank: number }> = ({teamName, rank}) => {
  const {teams, drop, award, punish} = useScoreboardState();
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="text-center">{rank == 1 ? '🥇 ' : rank == 2 ? '🥈 ' : rank == 3 ? '🥉 ': ''}{teamName}</CardTitle>
        <CardDescription className="text-center">#{rank}</CardDescription>
        <Button className="absolute top-5 right-5 text-white hover:text-base"
                variant="ghost"
                onClick={() => drop(teamName)}>Ｘ</Button>
      </CardHeader>
      <CardContent className="text-center font-semibold">
        <span className="text-5xl">{teams[teamName]}</span> points
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <Button className="bg-red-800 hover:bg-red-600" onClick={() => punish(teamName)}>Wrong</Button>
        <Button className="bg-green-600 hover:bg-green-500" onClick={() => award(teamName)}>Correct</Button>
      </CardFooter>
    </Card>
  );
};