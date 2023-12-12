import { DigitalcatalogPage } from './../pages/digitalcatalog/digitalcatalog';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,Events, App, ToastController, AlertController, MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../providers/constant/constant';
import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { AboutusModalPage } from '../pages/aboutus-modal/aboutus-modal';
import * as jwt_decode from "jwt-decode";
import { AppVersion } from '@ionic-native/app-version';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../pages/home/home';
// import {Push } from '@ionic-native/push';
// import { MobileLoginPage } from '../pages/login-section/mobile-login/mobile-login';
import { LanguagePage } from '../pages/language/language';
import { VideoPage } from '../pages/video/video';
import { FaqPage } from '../pages/faq/faq';
import { OfferListPage } from '../pages/offer-list/offer-list';
import { ContactPage } from '../pages/contact/contact';
import { AdvanceTextPage } from '../pages/advance-text/advance-text';
import { MainCategoryPage } from '../pages/main-category/main-category';
import { TransactionPage } from '../pages/transaction/transaction';
import { GiftListPage } from '../pages/gift-gallery/gift-list/gift-list';
import { CoupanCodePage } from '../pages/scane-pages/coupan-code/coupan-code';
import { RedeemTypePage } from '../pages/redeem-type/redeem-type';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    
    @ViewChild(Nav) nav: Nav;
    rootPage:any;
    tokenInfo:any='';
    ok:any;
    avl_upd:any;
    cancl:any;
    upd_now:any;
    lang:any='en';
    total_balance_point:any;
    user_type:any;
    idlogin:any;
    registration:any;
    notifications:any='';
    karigar_detail:any ={}

    
    constructor( public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public modalCtrl: ModalController,public storage:Storage,public events:Events,public constant:ConstantProvider, private app: App,public toastCtrl:ToastController,public service:DbserviceProvider,public alertCtrl:AlertController,public app_version:AppVersion,public translate:TranslateService,  public menu: MenuController,  public push:Push) 
    {
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);       
        
        // uncomment for logout
        // this.storage.set('token','');
        
        storage.get('token').then((val) =>
        {
            if(val == '' || val == null || val == undefined)
            {
                this.rootPage=LanguagePage;
            }else  if(val ){
                this.tokenInfo = this.getDecodedAccessToken(val );
                this.service.post_rqst({'karigar_id':this.tokenInfo.sub },'app_karigar/profile')
                .subscribe((r)=>
                {
                    console.log(r);
                    console.log(r['karigar'].user_type);
                    this.karigar_detail =  r.karigar;
                    console.log(this.karigar_detail);
                    
                    
                    if(r['status'] == "SUCCESS"){
                        
                        this.service.karigar_info = r['karigar'];


                        console.log(this.service);
                        

                        this.total_balance_point = parseInt( this.service.karigar_info.balance_point) + parseInt(this.service.karigar_info.referal_point_balance );

                        
                        if(this.service.karigar_info.del == '1')
                        {
                            this.rootPage=LanguagePage;
                            this.translate.get('Your Account has been suspended')
                            .subscribe(resp=>{
                                this.RequiredAlert(resp);
                            })
                            this.storage.set('token','');
                            this.events.publish('data','1', Date.now());
                            return;
                        }
                        else if(this.service.karigar_info.status == 'Verified' || r['karigar'].user_type==3)
                        {
                            // this.rootPage=HomePage;
                            this.initPushNotification();
                            this.rootPage=TabsPage;
                        } 
                        else  if( this.service.karigar_info.status != 'Verified' && (this.service.karigar_info.status != 'Verified' && r['karigar'].user_type!=3))
                        {
                            let contactModal = this.modalCtrl.create(AboutusModalPage);
                            contactModal.present();
                            return;
                        }
                    }
                    else
                    {
                        this.storage.set('token','');
                        this.events.publish('data','1', Date.now());
                        return;
                    }
                });
            }
        });
        
        events.subscribe('data',(data)=>
        {
            if(data==1)
            {
                storage.get('token')
                .then((val) => {
                    console.log(val);
                    
                    if(val == '' || val == null || val == undefined)
                    {
                        console.log('if');
                        this.nav.setRoot(LanguagePage);
                    }
                    else
                    { 
                         console.log('else');
                        this.nav.setRoot(TabsPage);
                        this.initPushNotification();
                        // this.nav.setRoot(HomePage);
                    }
                });
            }
            console.log(data);
        })
        
        platform.ready().then(() => {
            statusBar.overlaysWebView(false);
            splashScreen.hide();    
            statusBar.backgroundColorByHexString('#1957a0');   
            this.get_user_lang();
        });
        
        platform.registerBackButtonAction(() => {
            const overlayView = this.app._appRoot._overlayPortal._views[0];
            if (overlayView && overlayView.dismiss) {
                overlayView.dismiss();
                return;
            }
            
            let nav = app.getActiveNav();
            let activeView = nav.getActive().name;
            
            console.log(activeView);
            console.log(nav.canGoBack());
            
            if(activeView == 'HomePage' || activeView == 'MobileLoginPage' || activeView == 'OtpPage')
            {
                if(this.constant.backButton==0) 
                {
                    console.log('hello2');
                    
                    this.constant.backButton=1;
                    
                    let toast = this.toastCtrl.create({
                        message: 'Press again to exit!',
                        duration: 2000
                    });
                    
                    toast.present();
                    
                    setTimeout(() => 
                    {
                        this.constant.backButton=0;
                    },2500);
                    
                } 
                else 
                {
                    console.log('hello1');
                    this.platform.exitApp();
                }
                
            } 
            else if (nav.canGoBack()) 
            {
                console.log('ok');
                nav.pop();
            }
            else if(activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' || activeView =='MainHomePage')
            {
                nav.parent.select(0);
            }  
            else if(nav.canGoBack()==false) {
                let alert = this.alertCtrl.create({
                    title: 'Alert!',
                    message: 'Are you sure you want Exit?',
                    buttons: [
                        {
                            text: 'Stay',
                            handler: () => {
                                console.log('Cancel clicked');
                                // this.d.('Action Cancelled!')
                            }
                        },
                        {
                            text: 'Exit',
                            handler: () => {
                                this.platform.exitApp();
                            }
                        }
                    ]
                })
                
                alert.present();
                // this.platform.exitApp();
            } 
            // else 
            // {
            //     this.platform.exitApp();
            // }            
        });
    }
    getDecodedAccessToken(token: string): any
    {
        try{
            return jwt_decode(token);
        }
        catch(Error){
            return null;
        }
    }
    RequiredAlert(text)
    {
        this.translate.get("Alert")
        .subscribe(resp=>{
            let alert = this.alertCtrl.create({
                title:resp+'!',
                cssClass:'action-close',
                subTitle: text,
                buttons: [this.ok]
            });
            alert.present();
        })
    }
    
    version:any='';
    db_app_version:any='';
    check_version()
    {
        this.app_version.getVersionNumber()
        .then((resp)=>{
            console.log(resp);
            
            this.version = resp;
            this.service.post_rqst("","app_karigar/get_version")
            .subscribe(resp=>{
                console.log(resp);
                this.db_app_version = resp['version'];
                this.db_app_version = this.db_app_version.version;
                console.log(this.db_app_version);
                if(this.version != this.db_app_version)
                {
                    this.translate.get("OK")
                    .subscribe(resp=>{
                        this.ok = resp;
                    })
                    
                    this.translate.get("Update Available")
                    .subscribe(resp=>{
                        this.avl_upd = resp;
                    })
                    
                    this.translate.get('Cancel')
                    .subscribe(resp=>{
                        this.cancl = resp;
                    })
                    
                    this.translate.get('Update Now')
                    .subscribe(resp=>{
                        this.upd_now = resp;
                    })
                    
                    this.translate.get("A newer version of this app is available for download. Please update it from PlayStore")
                    .subscribe((resp)=>{
                        let updateAlert = this.alertCtrl.create({
                            title: this.avl_upd,
                            message: resp+'!',
                            buttons: [
                                {text: this.cancl, },
                                {text: this.upd_now,
                                    handler: () => {
                                        window.open('https://play.google.com/store/apps/details?id=com.teltechauto.app&hl=en','_system','location=yes');
                                    } 
                                }
                            ]
                        });
                        updateAlert.present();
                    })
                }
            })
        })
    }
    
    get_user_lang()
    {
        
        this.check_version();
        // this.storage.get("token")
        // .then(resp=>{
        //     console.log(resp);
        
        //     this.tokenInfo = this.getDecodedAccessToken(resp );
        //     console.log(this.tokenInfo);
        
        //     this.service.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
        //     .subscribe(resp=>{
        //         console.log(resp);
        //         this.lang = resp['language'];
        //         this.translate.use(this.lang);                                          
        
        //         // commented
        //         this.check_version();
        //     })
        // })
    }



    alert1(){
        let alert = this.alertCtrl.create({
            title:'Sorry!',
            cssClass:'action-close status-alert',
            subTitle:"Offer schemes are not available",
            buttons: [
                {
                    text: 'Okay',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();
    }
    
    alert2(){
        let alert = this.alertCtrl.create({
            title:'Sorry!',
            cssClass:'action-close status-alert',
            subTitle:"Gifts are not available",
            buttons: [
                {
                    text: 'Okay',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();
    }
    alert(){
        let alert = this.alertCtrl.create({
            title:'Sorry!',
            cssClass:'action-close status-alert',
            subTitle:"Your current profile status is not <strong class=Approved>“Verified”</strong>.To know more, you can call us at <a href=tel:+91 9302500080>+91 9302500080</a>.",
            buttons: [
                {
                    text: 'Okay',
                    handler: () => {
                    }
                }
            ]
        });
        alert.present();
    }
    
    
    closeMenu() {
        this.menu.close();
    }
    
    goOnOffersListPage(){
        this.alert2();
        return ;
        // this.nav.push(OfferListPage)
    }
    
    goOnContact(){
        this.nav.push(ContactPage);
    }
    
    goOnfaqPage()
    {
        this.nav.push(FaqPage);
    }
    
    goAboutPage()
    {
        this.nav.push(AdvanceTextPage);
    }
    
    goOnVideoPage()
    {
        this.nav.push(VideoPage);
    }
    
    // goOnDigitalcatalogPage()
    // {
    //     this.nav.push(MainCategoryPage);
    // }
    goOnDigitalcatalogPage()
    {
        this.nav.push(DigitalcatalogPage);
    }
    goOnGiftListPage()
    {
        console.log(this.karigar_detail.status);
        if(this.karigar_detail.status !='Verified'){
            this.alert();
            return 
        }else{
            this.nav.push(RedeemTypePage,{'mode':'home',"balance_point":this.total_balance_point, "redeem_point":this.service.karigar_info.redeem_balance, "Status":this.karigar_detail.status});  
        }
    //    else if(this.karigar_detail.user_type == '1'){
    //         this.nav.push(RedeemTypePage,{'mode':'home',"balance_point":this.total_balance_point, "redeem_point":this.service.karigar_info.redeem_balance, "Status":this.karigar_detail.status});  

    //     }else{
    //         this.nav.push(GiftListPage)
    //     }


    }
    gotoHistory()
    {
        this.nav.push(TransactionPage)
    }
    
    goOnGiftGallary()
    {
        this.alert1();
        return ;
        // this.nav.push(GiftListPage)
    }
    goOnProfile()
    {
        this.nav.push(ProfilePage)
    }
    
    goOnCoupon(){
        if(this.karigar_detail.status !='Verified'){
            this.alert();
            return 
        }
        else{
            this.nav.push(CoupanCodePage)
        }
    }


    
    initPushNotification()
    {
        this.push.hasPermission().then((res: any) => {
            if (res.isEnabled)
            {
                console.log('We have permission to send push notifications');
            }
            else
            {
                console.log('We don\'t have permission to send push notifications');
            }
        });

        const options: PushOptions = {
            android: {
                senderID: '792125577232',
                icon: './assets/imgs/logo_small',
                forceShow:true
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {}
        };

        const pushObject: PushObject = this.push.init(options);

        pushObject.on('notification').subscribe((notification: any) => {
            this.notifications = notification.additionalData.type

            if(notification.additionalData.type == 'offer'){
                this.nav.push(OfferListPage);
            }
            else if(notification.additionalData.type == 'redeem'){
                this.nav.push(TransactionPage);
            }
            else if(notification.additionalData.type == 'gift'){
                this.nav.push(GiftListPage);
            }
            else if(notification.additionalData.type == 'profile'){
                this.nav.push(ProfilePage);
            }
          });


        pushObject.on('registration')
        .subscribe((registration) =>{
            console.log( this.service.karigar_info, 'line number 355');
            console.log( this.service.karigar_info.id, 'line number 356');

            console.log('Device registered', registration);
            console.log('Device Token', registration.registrationId);

            this.storage.set('fcmId', registration);
            console.log( this.tokenInfo);
            console.log(this.storage);
            this.storage.get('user_type').then((user_type) => {
                this.user_type = user_type;
                console.log(this.user_type);
                console.log(user_type);
            });
            this.storage.get('userId').then((userId) => {
                this.idlogin = userId;
                console.log(this.idlogin);
                console.log(userId);
            });
            this.registration=registration.registrationId;
            this.registrationid(registration.registrationId);
        });

        pushObject.on('error')
        .subscribe((error) =>
        console.error('Error with Push plugin', error));
    }
    registrationid(registrationId){
        console.log("app components enter registration");
        console.log(registrationId);
        
        console.log('karigar information 386 id',this.service.karigar_info.id);
        console.log('karigar information 387 id',this.service.karigar_info);
        

        this.storage.get('userId').then((userId) => {
            this.idlogin = userId;
            console.log(this.idlogin,  this.idlogin);
            console.log("userId");
            console.log(userId);
        });

        console.log('karigar information 397 id',this.service.karigar_info);

        setTimeout(() =>{
            this.service.post_rqst({'registration_id':registrationId,'karigar_id':this.service.karigar_id},'app_karigar/add_registration_id')
            .subscribe((r)=>
            {
                console.log("success");
                console.log(r);

            });
        }, 5000);


    }
    
    
}
