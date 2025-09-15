import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { loadTokenFromStorage } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent implements OnInit {
  private store = inject(Store<AppState>);

  ngOnInit() {
    this.store.dispatch(loadTokenFromStorage());
  }
}
