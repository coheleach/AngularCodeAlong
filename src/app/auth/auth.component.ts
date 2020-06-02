import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})
export class AuthComponent {
    
    isLoginMode = true;
    isLoading = false;
    error = null;

    constructor(private authService: AuthService) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        
        console.log(form.value);
        this.isLoading = true;
        let signupLoginObservable: Observable<any>;
        if(this.isLoginMode) {
            signupLoginObservable = this.authService.login(form.value.email, form.value.password)    
        } else {
            signupLoginObservable = this.authService.signUp(form.value.email, form.value.password)
        }
        this.signupLoginSubscription(signupLoginObservable);
        this.isLoading = false;
        form.reset();
    }

    private signupLoginSubscription(observable: Observable<any>) {
        observable.subscribe(responseBody => {
            console.log(responseBody);
        }, errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
        });
    }
}