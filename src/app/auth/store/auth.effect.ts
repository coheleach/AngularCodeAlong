import { Actions, ofType, Effect } from '@ngrx/effects';
import * as fromAuthActions from './auth.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

class LoginSignUpResponsePayload {
    idToken: string
    email: string
    refreshToken: string
    expiresIn: string
    localId: string
    registered?: boolean
}

//
//          REVIEW
//
//      To internalize all Auth code to
//      NgRx, we merge the action & reducer
//      with an effect class.  Take the AuthService,
//      for example.  We are conceptionally
//      dividing it into the following:
//      
//      A) Login http request (indirectly state changing - called a side effect)
//      B) capture/Process the server response (directly state changing)
//
//      We do this by adding another Action dispatch
//      listener here, called AuthEffect.  It too listens
//      for dispatched actions, because though an action
//      may only be handled by some reducers, it is
//      still 'heard' by all reducers.  Hence, we
//      have made a new action called LoginStart and
//      handle it here.
//
//      NOTE: we handle indirect state changing actions
//      in the Effect class
//
@Injectable()
export class AuthEffect {
    
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(fromAuthActions.LOGIN_START),
        //return higher order inner observable
        switchMap((authData: fromAuthActions.LoginStart) => {
            return this.httpClient.post<LoginSignUpResponsePayload>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map((response: LoginSignUpResponsePayload) => {
                    const expirationDate = new Date(new Date().getTime() + (Number(response.expiresIn) * 1000));
                    return of(
                        new fromAuthActions.Login(
                            {
                                email: response.email,
                                id: response.localId,
                                token: response.idToken,
                                expirationDate: expirationDate
                            }
                        )
                    );
                }),
                //preserve returned observable
                catchError(error => {
                    return of();
                })
            )
        })
    )

    constructor(
        private actions$: Actions,      // ACTIONS is a stream of dispatched actions.  It cannot complete/die, so preserve it.
        private httpClient: HttpClient
    ) {}
}
