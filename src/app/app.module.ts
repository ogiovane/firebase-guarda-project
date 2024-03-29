// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// project import
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './theme/shared/shared.module';
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { NavigationComponent } from './theme/layouts/admin/navigation/navigation.component';
import { NavBarComponent } from './theme/layouts/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layouts/admin/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './theme/layouts/admin/nav-bar/nav-right/nav-right.component';
import { NavContentComponent } from './theme/layouts/admin/navigation/nav-content/nav-content.component';
import { NavCollapseComponent } from './theme/layouts/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavGroupComponent } from './theme/layouts/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavItemComponent } from './theme/layouts/admin/navigation/nav-content/nav-item/nav-item.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { OAuthModule, provideOAuthClient } from 'angular-oauth2-oidc';


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AdminComponent,
    GuestComponent,
    NavigationComponent,
    NavBarComponent,
    NavLeftComponent,
    NavRightComponent,
    NavContentComponent,
    NavCollapseComponent,
    NavGroupComponent,
    NavItemComponent
  ],
  imports: [BrowserModule, AppRoutingModule, SharedModule, BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase), AngularFireAuthModule, HttpClientModule, OAuthModule.forRoot(
      {
        resourceServer: {
          allowedUrls: ['https://accounts.google.com', 'http://localhost:4200/'],
          sendAccessToken: true
        }
      }
    ),
    AngularFireDatabaseModule, MatDialogModule,
    BrowserAnimationsModule],
  providers: [provideOAuthClient()],
})
export class AppModule {
}
