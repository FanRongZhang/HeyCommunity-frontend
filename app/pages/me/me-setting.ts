import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {Helper} from '../../other/helper.component';
import {Auth} from '../../other/auth.component';
import {UserService} from '../../services/user.service';


@Component({
  templateUrl: 'build/pages/me/me-setting.html'
})
export class MeSettingPage {
  constructor(
    private navCtrl: NavController,
    private auth: Auth,
    private userService: UserService
  ) {
  }

  goToPage() {
    console.log('hihihi');
  }


  //
  //
  goToLogOut() {
    this.userService.logOut()
    .then(ret => {
      this.auth.logOut();
      this.navCtrl.pop();
    });
  }
}
