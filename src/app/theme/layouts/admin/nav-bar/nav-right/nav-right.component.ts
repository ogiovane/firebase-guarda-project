// angular import
import { Component } from '@angular/core';
import { AuthService } from '../../../../../project/services/authentication/auth-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  // imports: [CommonModule],
})



export class NavRightComponent {
  constructor(protected authService: AuthService, private router: Router) {}
  // public method
  profile = [
    {
      icon: 'ti ti-edit-circle',
      title: 'Edit Profile'
    },
    {
      icon: 'ti ti-user',
      title: 'View Profile'
    },
    {
      icon: 'ti ti-clipboard',
      title: 'Social Profile'
    },
    {
      icon: 'ti ti-edit-circle',
      title: 'Billing'
    },
    {
      icon: 'ti ti-power',
      title: 'Logout',
      click: this.authService.logout()
    }
  ];

  setting = [
    {
      icon: 'ti ti-help',
      title: 'Support'
    },
    {
      icon: 'ti ti-user',
      title: 'Account Settings'
    },
    {
      icon: 'ti ti-lock',
      title: 'Privacy Center'
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History'
    }
  ];
}
