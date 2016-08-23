import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Helper} from '../../other/helper.component';
import {Timeline} from '../../models/timeline.model';
import {FileUploadService} from '../../services/fileUpload.service';
import {TimelineService} from '../../services/timeline.service';


@Component({
  templateUrl: 'build/pages/timeline/timeline-create.html',
  providers: [
    TimelineService,
    FileUploadService,
  ],
})
export class TimelineCreatePage {
  @ViewChild('inputImgs') inputImgsEl;

  newTimeline: {content?: string} = {};

  //
  imgs: any;

  //
  imgIdArr: number[] = [];


  //
  // constructor
  constructor(
    private nav: NavController,
    private helper: Helper,
    private navParams: NavParams,
    private fileUploadService: FileUploadService,
    private timelineService: TimelineService
  ) {
  }


  //
  // timeline create handler
  timelineCreateHandler(ngForm) {
    let data: any = {
      content: ngForm.value.content,
      imgs: JSON.stringify(this.imgIdArr),
    };

    this.timelineService.store(data)
    .then((newTimeline: Timeline) => {
      this.nav.pop();
    });
  }


  //
  //
  selectImgs() {
    this.inputImgsEl.nativeElement.click();
  }


  //
  //
  uploadImgs(event) {
    let files = event.srcElement.files;

    this.fileUploadService.upload(this.timelineService.timelineStoreImgAPI, files).then(data => {
      this.imgs = data.imgs;

      for (let i = 0; i < this.imgs.length; i++) {
        this.imgIdArr = this.imgIdArr.concat(this.imgs[i]['id']);
      }
      console.log(this.imgIdArr);
    });
  }
}
