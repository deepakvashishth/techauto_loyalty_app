import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from './../../providers/constant/constant';
import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, ModalController } from 'ionic-angular';
import { ImagemodalPage } from '../imagemodal/imagemodal';

/**
 * Generated class for the ProductImgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-img',
  templateUrl: 'product-img.html',
})
export class ProductImgPage {
  filter: any={};
  uploadUrl:any='';
    loading:Loading;
    constructor(public navCtrl: NavController, public navParams: NavParams,public translate:TranslateService,public db:DbserviceProvider,public constant:ConstantProvider,public loadingCtrl:LoadingController,public modalCtrl: ModalController) {
    this.uploadUrl = this.constant.upload_url;
    this.getProductList();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductImgPage');
  }


  presentLoading() 
  {
      this.translate.get("Please wait...")
      .subscribe(resp=>{
          this.loading = this.loadingCtrl.create({
              content: resp,
              dismissOnPageChange: false
          });
          this.loading.present();
      })
  }
  product_list:any=[];
  getProductList()
  {
      // this.filter.limit=0;
     
      this.db.post_rqst({'filter' : this.filter,'karigar_id':this.db.karigar_id},'app_karigar/catalogueImageList')
      .subscribe( (r) =>
      {
          console.log(r);
          // this.loading.dismiss();
          this.product_list=r['image'];
          console.log(this.product_list);
          
        
         
        
      });
  }

  flag:any='';
  loadData(infiniteScroll)
  {
      this.filter.limit=this.product_list.length;
      this.db.post_rqst({'filter' : this.filter,'karigar_id':this.db.karigar_id},'app_karigar/catalogueImageList')
      .subscribe( (r) =>
      {
          console.log(r);
          if(r=='')
          {
              this.flag=1;
          }
          else
          {
              setTimeout(()=>{
                  this.product_list=this.product_list.concat(r['image']);
                  console.log('Asyn operation has stop')
                  infiniteScroll.complete();
              },1000);
          }
      });
  }

  viewimage(image)
  {
    this.modalCtrl.create(ImagemodalPage, {"Image": image}).present();
      console.log(image);
  }

}
