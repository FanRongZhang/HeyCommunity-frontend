import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { Helper } from '../../other/helper';
import { AuthenticateComponent } from '../../pages/component/authenticate';

import { AuthenticateService } from '../../services/authenticate.service';
import { TimelineService } from '../../services/timeline.service';
import { UserService } from '../../services/user.service';

import { TimelineDetailPage } from '../../pages/timeline/timeline-detail';
import { TimelineCreatePage } from '../../pages/timeline/timeline-create';


@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html'
})
export class TimelinePage {
  //
  // constructor
  constructor(
    public helper: Helper,
    public authComp: AuthenticateComponent,
    public timelineService: TimelineService,
    public userService: UserService,
    public authService: AuthenticateService,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) {
  }


  //
  // ion view did enter
  ionViewDidLoad() {
    this.timelineService.getTimelines();

    //
    this.userService.getUser().then(data => {
      this.authService.logIn(data);
    }, data => {
      this.authService.logOut();
    });
  }


  //
  // goto timeline detail page
  gotoTimelineDetailPage(timeline) {
    this.navCtrl.push(TimelineDetailPage, {timeline: timeline});
  }


  //
  // set like for timeline
  setLikeForTimeline(timeline) {
    if (this.authService.isAuth) {
    } else {
      this.authComp.presentAuthModal();
    }
  }


  //
  // present timeline create modal
  presentTimelineCreateModal() {
    let modal = this.modalCtrl.create(TimelineCreatePage);
    modal.present();
  }


  //
  // Refresh
  doRefresh(refresher) {
    let params: any = {
      id: this.timelineService.timelines[0].id,
    }

    this.timelineService.refresh(params)
    .then(timelines => {
      refresher.complete();
    });
  }


  //
  // Infinite
  doInfinite(infiniteScroll) {
    let params: any = {
      id: this.timelineService.timelines[this.timelineService.timelines.length - 1].id,
    }

    this.timelineService.infinite(params)
    .then(timelines => {
      infiniteScroll.complete();
    });
  }
}
