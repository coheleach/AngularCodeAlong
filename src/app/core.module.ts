import { NgModule } from "@angular/core";
import { RecipesResolverService } from './recipes/recipes-resolver.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
    providers: [
        RecipesResolverService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true
        }
      ]
})
export class CoreModule {}