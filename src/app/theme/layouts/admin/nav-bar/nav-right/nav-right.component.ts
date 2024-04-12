// angular import
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth-service.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  // imports: [CommonModule],
})



export class NavRightComponent implements OnInit{
  userData: any;
  userDetails$: Observable<any>;

  constructor(protected authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUserData().then(data => {
      this.userData = data;
    });

    this.userDetails$ = this.authService.getCurrentUserDetails();

    }
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
      title: 'Privacy Center',
    },
    {
      icon: 'ti ti-messages',
      title: 'Feedback'
    },
    {
      icon: 'ti ti-list',
      title: 'History',
    }
  ];


  editarPerfil() {
    this.router.navigate(['/admin/editar-perfil']);
  }

}
