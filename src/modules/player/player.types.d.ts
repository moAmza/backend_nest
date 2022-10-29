type PlayerRolesType = 'Goalkeepers' | 'Defenders' | 'Midfielders' | 'Forwards';

type PopulatedWithStats<T> = T & {
  playerStats: MongoDoc<import('./stats.schema').Stats>;
};
