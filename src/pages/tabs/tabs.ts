import { DigitalcatalogPage } from './../digitalcatalog/digitalcatalog';
import { Component,ViewChild } from '@angular/core';
import {Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';
import { ProfilePage } from '../profile/profile';
import { MainHomePage } from '../main-home/main-home';
import { TransactionPage } from '../transaction/transaction';
import { Storage } from '@ionic/storage';
import { MobileLoginPage } from '../login-section/mobile-login/mobile-login';
import { TranslateService } from '@ngx-translate/core';
import * as jwt_decode from "jwt-decode";
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MainCategoryPage } from '../main-category/main-category';
import { OfferListPage } from '../offer-list/offer-list';
import { PointListPage } from '../points/point-list/point-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  index:any='';
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  tokenInfo:any={};
  lang:any='en';
  tab1Root = HomePage;
  tab2Root = OfferListPage;
  // tab3Root = MainHomePage;
  tab3Root = DigitalcatalogPage;
  tab4Root = PointListPage;
  
  constructor( public storage: Storage,public navParams: NavParams,public translate:TranslateService,public db:DbserviceProvider) {
    this.index = this.navParams.get('index');
    this.lang = this.navParams.get("lang");
console.log(this.lang);


    storage.get('token_value').then((val) => {
      console.log(val);
      if(val == '')
      {
        this.rootPage = MobileLoginPage;
      }else{
        this.rootPage = TabsPage;
      }
      
    });
    
    
  }
  // this.get_user_lang();
  
  get_user_lang()
  {
    this.storage.get("token")
    .then(resp=>{
      this.tokenInfo = this.getDecodedAccessToken(resp );
      
      this.db.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
      .subscribe(resp=>{
        console.log(resp);
        this.lang = resp['language'];
        if(this.lang == "")
        {
          this.lang = "en";
        }
        this.translate.use(this.lang);
      })
    })
  }
  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }
  
}
