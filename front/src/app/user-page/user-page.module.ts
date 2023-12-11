import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserPageComponent } from './user-page.component';
import { RepositoriesPageModule } from '../repositories-page/repositories-page.module';

@NgModule({
  declarations: [UserPageComponent],
  imports: [CommonModule, UserPageRoutingModule, RepositoriesPageModule],
})
export class UserPageModule {}
