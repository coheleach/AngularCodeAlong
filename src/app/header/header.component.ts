import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../Shared/data-storage.service';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import * as fromAppReducer from '../store/app.reducer'
import { Store } from '@ngrx/store';
import { exhaustMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  private user: User;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromAppReducer.AppState>
    ) { }

  ngOnInit() {
    this.store.select('auth').pipe(map(auth => auth.user)).subscribe(user => {
      this.user = user;
    });
  }
  
  ngOnDestroy() {
    //this.userSubscription.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
