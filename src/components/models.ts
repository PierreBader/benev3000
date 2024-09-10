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
  postes: string[];
  availability: string[];
}

export interface Assignation {
  idBenevole: number;
  periode: string;
  creneau: string;
  poste: string;
}

export interface Periode {
  id: number;
  name: string;
  creneaux: string[];
  postes: string[];
}

export interface Planning {
  name: string;
  benevoles: Benevole[];
  periodes: Periode[];
  assignations: Assignation[];
}
