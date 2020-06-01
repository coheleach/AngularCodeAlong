import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})
export class AuthComponent {
    
    isLoginMode = true;
    isLoading = false;

    constructor(private authService: AuthService) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {

        console.log(form.value);
        this.isLoading = true;
        if(this.isLoginMode) {
            // ...
        } else {
            this.authService.signUp(form.value.email, form.value.password)
                .subscribe(responseBody => {
                    console.log(responseBody);
                }, error => {
                    console.log(error);
                })
        }
        
        this.isLoading = false;
        form.reset();
    }
}