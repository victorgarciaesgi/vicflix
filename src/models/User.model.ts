export interface IUserState {
  profil: IProfil;
  loggedIn: boolean;
  authChecked?: boolean;
}

export interface IProfil {
  name: string;
  avatar: string;
}
