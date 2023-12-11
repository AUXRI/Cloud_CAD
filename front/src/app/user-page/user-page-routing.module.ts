import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPageComponent } from './user-page.component';
import { UserResolverService } from '../shared/resolvers/user-resolver';

const routes: Routes = [
  {
    // Страница со своими репозиториями
    path: '',
    component: UserPageComponent,
    resolve: {
      user: UserResolverService,
    },
    children: [
      {
        // TODO: Страница со репозиториями по пользователю
        path: ':userId',
        component: UserPageComponent,
      },
      // TODO: Страница со репозиториями по команде
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserPageRoutingModule {}
