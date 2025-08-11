import { Routes } from '@angular/router';
import { About } from './about/about';
import { GamesNav } from './games-nav/games-nav';
import { UniverseView } from './universe-view/universe-view';

export const routes: Routes = [
  {
    path: 'new/:gameId',
    title: 'New Game',
    component: UniverseView
  },
  {
    path: 'saved',
    title: 'Saved Games',
    component: GamesNav
  },
  {
    path: 'about',
    title: 'Conway\'s Game of Life',
    component: About
  }
];
