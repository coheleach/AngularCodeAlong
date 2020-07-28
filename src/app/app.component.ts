import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import * as fromAppReducer from './store/app.reducer';
import * as fromAuthActions from './auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private authService: AuthService, private store: Store<fromAppReducer.AppState>) {}

  ngOnInit() {
    //this.authService.autoLogin();
    this.store.dispatch(new fromAuthActions.AutoLogin());
  }

}
