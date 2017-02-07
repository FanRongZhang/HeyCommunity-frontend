import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { ImagePicker, Transfer } from 'ionic-native';

import { Timeline } from '../models/timeline.model';
import { TimelineImg } from '../models/timelineImg.model';

import { AppService } from '../../common/services/app.service';
import { TimelineService } from '../services/timeline.service';


@Component({
  selector: 'page-timeline-create',
  templateUrl: 'timeline-create.html',
})
export class TimelineCreatePage {
  newTimeline: {content?: string} = {};

  //
  waiting: boolean = false;

  //
  imgs: TimelineImg[] = [];

  //
  video: any;

  //
  imgIdArr: number[] = [];

  timeline: Timeline;


  //
  // constructor
  constructor(
    public heyApp: AppService,
    public timelineService: TimelineService,
    public navCtrl: NavController,
    public viewCtrl: ViewController
  ) {
  }


  //
  // timeline create handler
  timelineCreateHandler(ngForm) {
    if (this.waiting) {
      let params = {
        title: this.heyApp.translateService.instant('Waiting'),
        subTitle: this.heyApp.translateService.instant('Waiting For Upload Images Or Video'),
      }

      this.heyApp.utilityComp.presentAlter(params);
    } else {
      this.heyApp.utilityComp.presentLoading();

      let data: any = {
        content: ngForm.value.content,
        imgs: JSON.stringify(this.imgIdArr),
        video: this.video ? this.video.id : null,
      };

      this.timelineService.store(data)
      .then((newTimeline: Timeline) => {
        this.heyApp.utilityComp.dismissLoading();
        this.dismiss();
      });
    }
  }


  //
  // video play
  videoPlay(event) {
    if (event.srcElement.paused) {
      event.srcElement.play();
    } else {
      event.srcElement.pause();
    }
  }


  //
  //
  uploadImgsByNative() {
    let options = {quality: 75};
    ImagePicker.getPictures(options).then((results) => {
      this.waiting = true;
      let retImgs = [];

      for (var i = 0; i < results.length; i++) {
        const fileTransfer = new Transfer();
        let options: any;
        options = {
           fileKey: 'uploads[]',
           fileName: results[i].replace(/^.*[\\\/]/, ''),
           headers: {},
        }

        fileTransfer.upload(results[i], this.timelineService.timelineStoreImgAPI, options)
        .then((ret) => {
          this.waiting = false;

          // merge imgs
          this.mergeImgs(JSON.parse((<any> ret).response).imgs);
        }, (err) => {
          this.waiting = false;
        })
      }
    }, (err) => {
      console.log('ImagePIcker getPictures err', err);
    });
  }


  //
  // upload imgs
  uploadImgs(event) {
    this.waiting = true;
    let files = event.srcElement.files;

    this.heyApp.fileUploadService.upload(this.timelineService.timelineStoreImgAPI, files).then(data => {
      this.waiting = false;

      // merge imgs
      this.mergeImgs(data.imgs);
    }, () => {
      this.waiting = false;
    });
  }


  //
  // merge Imgs
  mergeImgs(imgs) {
    this.video = null;

    for (let i = 0; i < imgs.length; i++) {
      this.imgIdArr = this.imgIdArr.concat(imgs[i]['id']);
      this.imgs = this.imgs.concat(imgs[i]);
    }
  }


  //
  // upload video
  uploadVideo(event) {
    this.waiting = true;
    let files = event.srcElement.files;
    this.video = null;

    this.heyApp.fileUploadService.upload(this.timelineService.timelineStoreVideoAPI, files).then(data => {
      this.waiting = false;
      this.imgs = data.imgs;
      this.video = data;
      this.imgIdArr = [];
    }, () => {
      this.waiting = false;
    });
  }


  //
  // dismiss
  dismiss() {
    this.viewCtrl.dismiss();
  }


}
