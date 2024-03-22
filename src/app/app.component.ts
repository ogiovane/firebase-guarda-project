// angular import
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }
}
