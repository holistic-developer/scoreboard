import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Teams = {
  [key: string]: number;
}

const initialTeams: Teams = {
  'The Best': 0,
  'Champions': 0,
  'Contenders': 0,
};

export const useScoreboardState = create(
  persist<{
    teams: Teams;
    history: Teams[];
    award: (teamName: string) => void
    punish: (teamName: string) => void
    add: (teamName: string) => void
    drop: (teamName: string) => void
    reset: () => void
    undo: () => void
  }>((set) => ({
      teams: initialTeams,
      history: [],
      award: teamName => set(({teams, history}) => {
        const newTeams = {...teams, [teamName]: teams[teamName] + 10}
        return ({teams: newTeams, history:[...history, teams]});
      }),
      punish: teamName => set(({teams, history}) => {
        const newTeams = {} as Teams;
        for (const t in teams) {
          if (t != teamName) {
            newTeams[t] = teams[t] + 1;
          } else {
            newTeams[t] = teams[t]
          }
        }
        return {teams: newTeams,  history:[...history, teams]};
      }),
      add: teamName => set(({teams, history}) => {
        if (!teamName || !!teams[teamName]) return {};
        const newTeams = {...teams, [teamName]: 0};
        return {teams: newTeams,  history:[...history, teams]};
      }),
      drop: teamName => set(({teams}) => {
        delete teams[teamName];
        return teams;
      }),
      reset: () => set({teams: {}, history: []}),
      undo: () => set(({history}) => ({teams: history.pop() ?? {} as Teams}))
    }),
    {name: 'scoreboard', storage: createJSONStorage(() => localStorage)}));