export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Benevole {
  id: number;
  name: string;
  email: string;
  postes?: string[];
  availability?: Timeslot[];
}

export interface Timeslot {
  start: Date;
  end: Date;
}

export interface Assignation {
  idBenevole: number;
  creneauName: string;
  poste: string;
}

export interface Periode {
  id: number;
  name: string;
  creneaux: Creneau[];
  postes: string[];
}

export interface Creneau {
  id: number;
  name: string;
}

export interface Planning {
  name: string;
  benevoles: Benevole[];
  periodes: Periode[];
  assignations: Assignation[];
}
