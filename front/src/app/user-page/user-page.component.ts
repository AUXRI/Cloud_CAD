import { Component, OnInit } from '@angular/core';
import { RepositoryI } from '../shared/models/repository.interface';
import { RepositoryService } from '../shared/services/repository.service';
import { UserService } from '../shared/services/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  repositories: RepositoryI[] = [];

  constructor(private repositoryService: RepositoryService, private userService: UserService) {}

  ngOnInit(): void {
    /**
     * TODO:
     * 1. Страница с репозиториями текущего пользователя на пустой маршрут
     * 2. Страница с публичными репозиториями выбранного пользователя на маршрут /:userId
     * 3. Страница с публичными репозиториями выбранной команды на маршрут /team/:teamId
     */

    this.userService.getUser().pipe(
      switchMap((user) => {
        return this.repositoryService.getByUser(user._id);
      }),
    ).subscribe((repositories) => {
      this.repositories = repositories;
    });
  }
}
