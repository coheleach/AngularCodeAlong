import { Component, ComponentFactoryResolver, ComponentFactory, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../Shared/alert/alert.component';
import { PlaceholderDirective } from '../Shared/placeholder/placeholder.directive';
import * as fromAppReducer from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})
export class AuthComponent implements OnDestroy {

    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    isLoginMode = true;
    isLoading = false;
    error = null;
    closeSub: Subscription;

    constructor(
        private authService: AuthService,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromAppReducer.AppState>
    ) {}

    ngOnDestroy() {
        if(this.closeSub != null) {
            this.closeSub.unsubscribe();
        }
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        
        console.log(form.value);
        this.isLoading = true;
        let signupLoginObservable: Observable<any>;
        if(this.isLoginMode) {
            this.store.dispatch(
                new AuthActions.LoginStart(
                    {
                        email: form.value.email, 
                        password: form.value.password
                    }
                )
            //signupLoginObservable = this.authService.login(form.value.email, form.value.password)    
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
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            this.showErrorAlert(errorMessage);
            console.log(errorMessage);
            this.error = errorMessage;

        });
    }

    public onHandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {
        let alertComponentFactory: ComponentFactory<AlertComponent> = 
        this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostContainerRef = this.alertHost.viewContainerRef;
        hostContainerRef.clear();
        let componentRef = hostContainerRef.createComponent(alertComponentFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostContainerRef.clear();
        });
    }
}