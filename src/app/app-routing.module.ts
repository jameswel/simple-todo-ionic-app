import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/']);

const redirectLoggedInToProjects = () => redirectLoggedInTo(['/projects'])

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule), ...canActivate(redirectLoggedInToProjects) },
  { path: 'projects', loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsPageModule), ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'notes/:projectId', loadChildren: () => import('./pages/notes/notes.module').then(m => m.NotesPageModule), ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'add-todo/:projectId', loadChildren: () => import('./pages/add-todo/add-todo.module').then(m => m.AddTodoPageModule), ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
