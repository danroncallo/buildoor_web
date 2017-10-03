import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent} from './admin/admin.component';
import {MenuComponent} from './menu/menu.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';


@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: MenuComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'login', component: AdminLoginComponent },
      { path: 'recovery', component: PasswordRecoveryComponent },
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
