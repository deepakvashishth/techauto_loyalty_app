import { ProductImgPage } from './../product-img/product-img';
import { DigitalcatalogPage } from './../digitalcatalog/digitalcatalog';
import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController, ModalController, NavParams } from 'ionic-angular';
import { ScanPage } from '../scane-pages/scan/scan';
import { OfferListPage } from '../offer-list/offer-list';
import { PointListPage } from '../points/point-list/point-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OffersPage } from '../offers/offers';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';
import { ViewProfilePage } from '../view-profile/view-profile';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CoupanCodePage } from '../scane-pages/coupan-code/coupan-code';
import { ProfilePage } from '../profile/profile';
import { TermsPage } from '../terms/terms';
import { AboutusModalPage } from '../aboutus-modal/aboutus-modal';
import * as jwt_decode from "jwt-decode";
import { TranslateService } from '@ngx-translate/core';
import { ConstantProvider } from '../../providers/constant/constant';
import { CompassPage } from '../compass/compass';
// import { AboutPage } from '../about/about';
import { FurnitureIdeasPage } from '../furniture-ideas/furniture-ideas';
import { ProductsPage } from '../products/products';
import { WorkingSitePage } from '../working-site/working-site';
import { FeedbackPage } from '../feedback/feedback';
import { NewsPage } from '../news/news';
import { VideoPage } from '../video/video';
import { ContactPage } from '../contact/contact';
import { FaqPage } from '../faq/faq';
import { TransactionPage } from '../transaction/transaction';
import { AdvanceTextPage } from '../advance-text/advance-text';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NotificationPage } from '../notification/notification';
import { LanguagePage } from '../language/language';
import { ArrivalProductPage } from '../arrival-product/arrival-product';
import { OfferProductPage } from '../offer-product/offer-product';
import { MainCategoryPage } from '../main-category/main-category';
import { ProfileEditModalPage } from '../profile-edit-modal/profile-edit-modal';
import { RedeemTypePage } from '../redeem-type/redeem-type';
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    offer_list:any=[];
    loading:Loading;
    karigar_detail:any={};
    last_point:any='';
    point_details:any='';
    today_point:any='';
    appbanner:any={};
    qr_code:any='';
    testRadioOpen:any='';
    value:string='';
    
    coupon_value:any='';
    uploadUrl:any='';
    tokenInfo:any = {};
    lang:any="";
    active:boolean = false;
    offer_detail:any={};
    language:any=[];
    toggle:boolean = false;
    Status_flag: number;
    constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider,public loadingCtrl:LoadingController,public storage:Storage, private barcodeScanner: BarcodeScanner,public alertCtrl:AlertController,public modalCtrl: ModalController,private push: Push,public translate:TranslateService,public constant:ConstantProvider,public socialSharing:SocialSharing) {
        this.presentLoading();
        this.notification();
        this.lang = this.navParams.get("lang");
    }
    ionViewWillEnter()
    {
        this.uploadUrl = this.constant.upload_url;
        console.log('ionViewDidLoad HomePage');
        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        this.getData();
        // this.get_user_lang();
        this.getofferBannerList();
    }


    toggleValue(value){
        console.log('====================================');
        console.log(value);
        console.log('====================================');
        if(value == 'false'){
          this.toggle = true;  
        }
        else{
            this.toggle = false;  
        }
    }
    
    doRefresh(refresher) 
    {
        console.log('Begin async operation', refresher);
        this.getData(); 
        refresher.complete();
    }
    
    total_balance_point:any;
    sharepoint:any=0;
    notify_cn=0;
    getData()
    {
        console.log("Check");
        this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/karigarHome')
        .subscribe((r:any)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.language=r['language'];
            this.karigar_detail=r['karigar'];
            this.appbanner=r['appbanner'];
            console.log(this.appbanner);
           this.Status_flag =  this.karigar_detail.Status_flag;
            console.log( this.Status_flag);
            
            console.log(this.karigar_detail.status);
            console.log(r['status'] == 'Verified' &&  this.Status_flag==1);
            
            if(r['status'] == 'Verified' &&  this.Status_flag==1){
                this.translate.get("Welcome to tal family- enjoy 100 welcome points.")
                .subscribe(resp=>{
                    this.showSuccess(resp);
                })
                return;
            }
            if(this.karigar_detail.user_type!=3){
                
                this.offer_detail=r['offer'];
                this.last_point=r['last_point'];
                this.point_details=r['point_details'];
                this.notify_cn=r['notifications'];
                this.today_point=r['today_point'];
                this.total_balance_point = parseInt( this.karigar_detail.balance_point) + parseInt(this.karigar_detail.referal_point_balance );
                this.sharepoint=r['points']['owner_ref_point'];
                
            }
        });
    }
    
    
    getofferBannerList()
    {
        console.log(this.service.karigar_id);
        console.log('offerbanner');
        this.service.post_rqst({'karigar_id':this.service.karigar_id},'app_karigar/offerList')
        .subscribe((r)=>
        {
            console.log(r);
            this.offer_list=r['offer'];
            console.log(this.offer_list);
        });
    } 
    
    ok:any;
    alert:any;
    cancl:any;
    update_text:any;
    
    
    scan_tips()
    {
        this.scan();
    }
    
    
    qr_count:any=0;
    qr_limit:any=0;
    
    
    scanCoupon() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Coupon');
        
        alert.addInput({
            type: 'radio',
            label: 'Coupon Scan',
            value: 'scan',
            checked: true
        });
        alert.addInput({
            type: 'radio',
            label: 'Enter Coupon Code',
            value: 'code',
            
        });
        
        alert.addButton('Cancel');
        alert.addButton({
            text: 'OK',
            handler: data => {
                this.testRadioOpen = false;
                // this.testRadioResult = data;
                this.value = data;
                console.log("redio val =====>",this.value)
                if(this.value == 'scan'){
                    this.scan();
                }else if(this.value == 'code'){
                    this.navCtrl.push(CoupanCodePage)
                }
                
            }
        });
        alert.present();
    }



    // Scan funcation old funcation 
    // scan()
    // {
    
    //     if( this.karigar_detail.manual_permission==1)
    //     {
    //         this.navCtrl.push(CoupanCodePage)
    //     }
    //     else
    //     {
    //         console.log('else Funcation');
    
    //         this.service.post_rqst({'karigar_id':this.service.karigar_id},"app_karigar/get_qr_permission")
    //         .subscribe(resp=>{
    //             console.log(resp);
    //             this.qr_count = resp['karigar_daily_count'];
    //             this.qr_limit = resp['qr_limit'];
    //             console.log(this.qr_count);
    //             console.log(this.qr_limit);
    
    //             if(parseInt(this.qr_count) <= parseInt(this.qr_limit) )
    //             {
    //                 const options:BarcodeScannerOptions =  { 
    //                     prompt : ""
    //                 };
    //                 this.barcodeScanner.scan(options).then(resp => {
    //                     console.log(resp);
    //                     this.qr_code=resp.text;
    //                     console.log( this.qr_code);
    //                     if(resp.text != '')
    //                     {
    //                         this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code},'app_karigar/karigarCoupon')
    //                         .subscribe((r:any)=>
    //                         {
    //                             console.log(r);
    
    //                             if(r['status'] == 'INVALID'){
    //                                 this.translate.get("Invalid Coupon Code")
    //                                 .subscribe(resp=>{
    //                                     this.showAlert(resp);
    //                                 })
    //                                 return;
    //                             }
    //                             else if(r['status'] == 'NOTAUTHORISED'){
    //                                 this.translate.get("Coupon not authorised")
    //                                 .subscribe(resp=>{
    //                                     this.showAlert(resp);
    //                                 })
    //                                 return;
    //                             }
    //                             else if(r['status'] == 'USED'){
    //                                 this.translate.get("Coupon Already Used")
    //                                 .subscribe(resp=>{
    //                                     this.showAlert(resp);
    //                                 })
    //                                 return;
    //                             }
    //                             else if(r['status'] == 'UNASSIGNED OFFER'){
    //                                 this.translate.get("Your Account Under Verification")
    //                                 .subscribe(resp=>{
    //                                     this.showAlert(resp);
    //                                 })
    //                                 return;
    //                             }
    //                             this.translate.get("points has been added into your wallet")
    //                             .subscribe(resp=>{
    //                                 this.showSuccess( r['coupon_value'] +resp)
    //                             })
    //                             this.getData();
    //                         });
    //                     }
    //                     else{
    //                         console.log('not scanned anything');
    //                     }
    //                 });
    //             }
    //             else
    //             {
    //                 this.translate.get("You have exceed the daily QR scan limit")
    //                 .subscribe(resp=>{
    //                     this.showAlert(resp);
    //                 })
    //             }
    //         })
    //     }
    // }
    
    
    scan()
    {
        
        if( this.karigar_detail.status !='Verified'){
            let alert = this.alertCtrl.create({
                title:'Sorry!',
                cssClass:'action-close',
                subTitle:"Your current profile status is not  <strong>“Verified”</strong>. You only scan the coupon codes when your profile status is <strong class=Approved>“Verified”</strong>. To know more, you can call us at <a href=tel:+91 1493 294 181>+91 1493 294 181</a> or chat with us.",
                buttons: [
                    // {
                    //     text: 'Chat With Us',
                    //     handler: () => {
                    //         this.goChat();
                    //     }
                    // },
                    {
                        text: 'Okay',
                        handler: () => {
                        }
                    }
                ]
            });
            alert.present();  
            return
        }
        
            if( this.karigar_detail.manual_permission==1)
            {
                this.navCtrl.push(CoupanCodePage)
            }
            else
            {
                console.log('else Funcation');
                
                this.service.post_rqst({'karigar_id':this.service.karigar_id},"app_karigar/get_qr_permission")
                .subscribe(resp=>{
                    console.log(resp);
                    this.qr_count = resp['karigar_daily_count'];
                    this.qr_limit = resp['qr_limit'];
                    console.log(this.qr_count);
                    console.log(this.qr_limit);
                    
                    if(parseInt(this.qr_count) <= parseInt(this.qr_limit) )
                    {
                        const options:BarcodeScannerOptions =  { 
                            prompt : ""
                        };
                        this.barcodeScanner.scan(options).then(resp => {
                            console.log(resp);
                            this.qr_code=resp.text;
                            console.log( this.qr_code);
                            if(resp.text != '')
                            {
                                this.service.post_rqst({'karigar_id':this.service.karigar_id,'qr_code':this.qr_code},'app_karigar/karigarCoupon')
                                .subscribe((r:any)=>
                                {
                                    console.log(r);
                                    
                                    
                                    
                                    if(r['status'] == 'INVALID'){
                                        this.translate.get("Invalid Coupon Code")
                                        .subscribe(resp=>{
                                            this.showAlert(resp);
                                        })
                                        return;
                                    }
                                    else if(r['status'] == 'NOTAUTHORISED'){
                                        this.translate.get("Coupon not authorised")
                                        .subscribe(resp=>{
                                            this.showAlert(resp);
                                        })
                                        return;
                                    }
                                    else if(r['status'] == 'USED'){
                                        this.translate.get("Coupon Already Used")
                                        .subscribe(resp=>{
                                            this.showAlert(resp);
                                        })
                                        return;
                                    }
                                    else if(r['status'] == 'UNASSIGNED OFFER'){
                                        this.translate.get("Your Account Under Verification")
                                        .subscribe(resp=>{
                                            this.showAlert(resp);
                                        })
                                        return;
                                    }
                                    else if(r['status'] == 'NO-OFFER'){
                                        this.translate.get("No Offer On This Coupon")
                                        .subscribe(resp=>{
                                            this.showAlert(resp);
                                        })
                                        return;
                                    }
                                    else if(r['status'] == 'VALID'){
                                        this.translate.get(" Point has been add your wallet")
                                        .subscribe(resp=>{
                                            this.showSuccess( r['coupon_value'] + resp);
                                        })
                                        return;
                                    }
                                    
                                    
                                    // if(r['result'].status == 'SUCCESS'){
                                    //     this.translate.get(" rupees has been transfer into your paytm wallet")
                                    //     .subscribe(resp=>{
                                    //         this.showSuccess( r['coupon_value'] + resp);
                                    
                                    //     })
                                    // }
                                    // else if(r['result'].status == 'PENDING'){
                                    //     r['result'].statusMessage;
                                    //     this.translate.get("Request InProcess, Check Paytm Wallet After Some Time!")
                                    //     .subscribe(resp=>{
                                    //         this.showAlert(resp);
                                    //     })
                                    // }
                                    // this.getData();
                                });
                            }
                            else{
                                console.log('not scanned anything');
                            }
                        });
                    }
                    else
                    {
                        this.translate.get("You have exceed the daily QR scan limit")
                        .subscribe(resp=>{
                            this.showAlert(resp);
                        })
                    }
                })
            }
        



       
    }

    goOnDigitalcatalogPage()
    {
        this.navCtrl.push(DigitalcatalogPage);
    }
   
 

  goOnContact(){
        this.navCtrl.push(ContactPage);
    }
    
  
    
    goAboutPage()
    {
        this.navCtrl.push(AdvanceTextPage);
    }
    
    
    
    EnterCouponCode(){
        this.navCtrl.push(CoupanCodePage)
    }
    
    viewProfiePic()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile,type:"base_64"}).present();
    }
    
    viewProfie()
    {
        console.log(this.lang);
        
        this.navCtrl.push(ProfilePage,{'lang':this.lang})
    }
    
    change_language(){
        this.navCtrl.push(LanguagePage);
    }

    goOnScanePage(){
        this.navCtrl.push(ScanPage);
    }
    
    goOnOffersListPage(){
       
        this.navCtrl.push(OfferListPage);
        
    }
    goOnOffersPage(id)
    {
        this.navCtrl.push(OffersPage,{'id':id});
    }
    
    goOnPointeListPage(){
        this.navCtrl.push(PointListPage);
        
    }
    goOnWorkingSitePage()
    {
        this.navCtrl.push(WorkingSitePage);
    }
    gotoCompass()
    {
        this.navCtrl.push(CompassPage);
    }
    
    goOntermsPage(id){
        this.navCtrl.push(TermsPage, {'id':id});
    }
    
    goOnFeedbackPage()
    {
        this.navCtrl.push(FeedbackPage);
    }
    presentLoading() 
    {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: false
        });
        this.loading.present();
    }
    // goOnGiftListPage()
    // {
    //     this.navCtrl.push(GiftListPage,{'mode':'home'});
    // }
    
    goOnFurniturePage()
    {
        this.navCtrl.push(FurnitureIdeasPage);
    }
    goOnProductsPage()
    {
        this.navCtrl.push(ProductsPage);
    }
    goOnCategoryPage(){
        this.navCtrl.push(MainCategoryPage);
    }
    goOnArrivalProductsPage(){
        this.navCtrl.push(ArrivalProductPage);
    }
    goOnOfferProductsPage(){
        this.navCtrl.push(OfferProductPage);
    }
    viewDetail()
    {
        console.log( this.point_details);
        this.modalCtrl.create(ViewProfilePage, {"Image": this.point_details,"type":"point_img"}).present();
    }
   
    
    viewDetail2()
    {
        this.navCtrl.push(ProductImgPage)
    }
    gotoHistory()
    {
        this.navCtrl.push(TransactionPage)
    }
    goOnGiftGallary()
    {
       
        this.navCtrl.push(GiftListPage)
    }
    goOnNewsPage()
    {
        this.navCtrl.push(NewsPage);
    }

    alert1(){
        let alert = this.alertCtrl.create({
            title:'Sorry!',
            cssClass:'action-close status-alert',
            subTitle:"Your current profile status is not <strong class=Approved>“Verified”</strong>.To know more, you can call us at <a href=tel:+91 1493 294 181>+91 1493 294 181</a>.",
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


  
    goOnProfile()
    {
        this.navCtrl.push(ProfilePage)
    }

    goOnRedeemListPage(){
       console.log(this.karigar_detail.user_type);
       if(this.karigar_detail.status !='Verified'){
        this.alert1();
        return 
    }else{
        this.navCtrl.push(RedeemTypePage,{'mode':'home',"balance_point":this.total_balance_point, "redeem_point":this.karigar_detail.redeem_balance, "Status":this.karigar_detail.status,'bank_name':this.karigar_detail.bank_name,'account_no':this.karigar_detail.account_no,'ifsc_code':this.karigar_detail.ifsc_code,'account_holder_name':this.karigar_detail.account_holder_name});

    }
       
    //    else if(this.karigar_detail.user_type == '1'){
    //         this.navCtrl.push(RedeemTypePage,{'mode':'home',"balance_point":this.total_balance_point, "redeem_point":this.karigar_detail.redeem_balance, "Status":this.karigar_detail.status});
    //     }else{
    //         this.navCtrl.push(GiftListPage)
    //     }
        
    }
    goOnVideoPage()
    {
        this.navCtrl.push(VideoPage);
    }
    goOnContactPage()
    {
        this.navCtrl.push(ContactPage);
    }
    goOnfaqPage()
    {
        this.navCtrl.push(FaqPage);
    }
    goOnAdvanceTextPage()
    {
        this.navCtrl.push(AdvanceTextPage);
    }
    gotoNotification()
    {
        this.navCtrl.push(NotificationPage);
    }
    gotoChangeLang()
    {
        this.navCtrl.push(LanguagePage,{"come_from":"homepage"});
    }
    share()
    {
        console.log("share and earn");
        // let image = "https://play-lh.googleusercontent.com/FEDtMP_dyMgM8rJtp4MFdp60g0fLuBYNbu3pBNsNH52knTsG1yDuNs56CFYu_X3XqYk=s180-rw";
        
        let image = "";
        let app_url = "https://play.google.com/store/apps/details?id=com.techauto.app";
        
        this.socialSharing.share("Hey there join me (" + this.karigar_detail.full_name + "-" + this.karigar_detail.mobile_no + ") on Tech Auto ,app. Enter my code *" + this.karigar_detail.referral_code + "* to earn points back in your wallet!", "Reffral", image, app_url)
        .then(resp=>{
            console.log(resp,'called');
            
        }).catch(err=>{
            console.log(err);
        }) 
    }
    showAlert(text)
    {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
    showSuccess(text)
    {
        let alert = this.alertCtrl.create({
            title:'Success!',
            cssClass:'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
    
    notification()
    {
        console.log("notification called");
        
        this.push.hasPermission()
        .then((res: any) => {
            
            if (res.isEnabled) {
                console.log('We have permission to send push notifications');
            } else {
                console.log('We do not have permission to send push notifications');
            }
        });
        
        
        const options: PushOptions = {
            android: {
                senderID:'792125577232',
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'true'
            },
            windows: {
                
            },
        };
        
        const pushObject: PushObject = this.push.init(options);
        
        pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
        pushObject.on('registration').subscribe((registration: any) => {
            console.log('Device registered', registration) 
            this.service.post_rqst({'id':this.service.karigar_id,'registration_id':registration.registrationId},'app_karigar/update_token').subscribe((r)=>
            {
                console.log(r);
                console.log("tokken saved");
                
            });
        }
        );
        
        pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }
    
    openModal()
    {
        let contactModal = this.modalCtrl.create(AboutusModalPage);
        contactModal.present();
        return;
    }
    
    
    
    
    get_user_lang()
    {
        this.storage.get("token")
        .then(resp=>{
            this.tokenInfo = this.getDecodedAccessToken(resp );
            
            this.service.post_rqst({"login_id":this.tokenInfo.sub},"app_karigar/get_user_lang")
            .subscribe(resp=>{
                console.log(resp);
                this.lang = resp['language'];
                console.log(this.lang);
                
                if(this.lang == "")
                {
                    this.lang = "en";
                }
                console.log(this.lang);
                this.translate.use(this.lang);
            })
        })
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
    
    

   
}
