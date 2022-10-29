export class TypeFplPlayerDto {
  refId: number;
  firstName: string;
  secondName: string;
  webname: string;
  club: string;
  role: 'Goalkeepers' | 'Defenders' | 'Midfielders' | 'Forwards';
  score: number;
  price: number;
}
