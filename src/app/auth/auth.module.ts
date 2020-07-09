import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../Shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        SharedModule,
        FormsModule,
        AuthRoutingModule
    ]
})
export class AuthModule {}