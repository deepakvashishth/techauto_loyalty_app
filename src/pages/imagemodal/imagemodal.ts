import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * Generated class for the ImagemodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-imagemodal',
  templateUrl: 'imagemodal.html',
})
export class ImagemodalPage {
  view_image:any;
  uploadUrl:any='';



  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController,public constant:ConstantProvider,) {
    this.uploadUrl = this.constant.upload_url;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagemodalPage');
    this.view_image=this.navParams.get("Image");
    console.log(this.view_image);
    
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

}
