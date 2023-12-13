import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Loading,Nav } from 'ionic-angular';
import { CancelationPolicyPage } from '../cancelation-policy/cancelation-policy';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TransactionPage } from '../transaction/transaction';
// import { TabsPage } from '../tabs/tabs';
// import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
// import { RegistrationPage } from '../login-section/registration/registration';
import { ProfilePage } from '../profile/profile';
import { TabsPage } from '../tabs/tabs';



@IonicPage()
@Component({
    selector: 'page-cancelpolicy-modal',
    templateUrl: 'cancelpolicy-modal.html',
})
export class CancelpolicyModalPage {
    @ViewChild(Nav) nav: Nav;
    data:any={};
    otp_value:any='';
    karigar_id:any=''
    otp:any='';
    karigar_detail:any={};
    gift_id:any='';
    gift_detail:any='';
    loading:Loading;
    redeemType:any={};
    redeemPoint:any={};
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public service:DbserviceProvider,public alertCtrl:AlertController,public loadingCtrl:LoadingController, public translate:TranslateService) {
        this.redeemType = this.navParams.get('redeem_type');
        this.redeemPoint = this.navParams.get('redeem_point');
        console.log(this.redeemType);
        
        
        this.karigar_id = this.navParams.get('karigar_id');
        this.gift_id = this.navParams.get('gift_id');
    }
    
    ionViewDidLoad() {
        console.log('ionViewDidLoad CancelpolicyModalPage');
        this.karigar_id = this.navParams.get('karigar_id');
        console.log(this.karigar_id);
        this.gift_id = this.navParams.get('gift_id');
        console.log(this.gift_id);
        this.getOtpDetail();
        this.presentLoading();
    }
    
    
    dismiss() {
        let data = { 'foo': 'bar' };
        this.viewCtrl.dismiss(data);
    }
    
    goOnCancelationPolicy(){
        this.navCtrl.push(CancelationPolicyPage)
    }
    
    getOtpDetail()
    {
        console.log('otp');
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'gift_id':this.gift_id,"redeem_amount":this.redeemPoint},'app_karigar/sendOtp')
        .subscribe((r)=>
        {
            console.log(r);
            this.loading.dismiss();
            this.otp=r['otp'];
            console.log(this.otp);
            this.data=r['karigar'];
            console.log(this.data);
            
            this.karigar_detail=r['karigar'];
            console.log('====================================');
            console.log(this.karigar_detail);
            console.log('====================================');
            this.gift_detail=r['gift'];
        });
    }
    resendOtp()
    {
        
        this.service.post_rqst({'karigar_id':this.service.karigar_id,'gift_id':this.gift_id,"redeem_amount":this.redeemPoint},'app_karigar/sendOtp')
        .subscribe((r)=>
        {
            
            console.log(r);
            this.otp=r['otp'];
            console.log(this.otp);
        });
    }
    otpvalidation() 
    {
        this.otp_value=false;
        if(this.data.otp==this.otp)
        {
            this.otp_value=true
        }
    }
    
    submit()
    {
        if(!this.otp_value){
            this.showAlert("OTP required");
            return
        }
         if(this.redeemType == 'gift'){
            
            if(!this.data.shipping_address){
                this.showAlert("Shipping address required");
                return
            }
        }
        else if(this.redeemType == 'Cash'){
            if(!this.data.account_holder_name  || !this.data.bank_name || !this.data.account_no || !this.data.ifsc_code || !this.data.document_no || !this.data.document_image){
                this.showAlert("Bank details are missing");
                return;
            }
        }
        if(!this.data.check){
            this.showAlert("Read cancelation policy");
            return
        }
        this.presentLoading();
        console.log('data');
        console.log(this.data);
        this.data.karigar_id = this.service.karigar_id,
        this.data.gift_id = this.gift_id,
        this.data.redeem_type = this.redeemType
        this.data.redeem_amount=  this.redeemPoint
        this.data.offer_id = this.gift_detail.offer_id;
        if(this.redeemType == 'gift'){

            this.data.ifsc_code='';
            this.data.account_no='';
            this.data.account_holder_name='';
            this.data.bank_name='';
            this.data.document_no='';
            this.data.document_image='';

        }
        this.service.post_rqst( {'karigar_id':this.data.karigar_id,'gift_id':this.data.gift_id,'redeem_type':this.data.redeem_type,'offer_id':this.data.offer_id,'redeem_amount':this.data.redeem_amount,'ifsc_code':this.data.ifsc_code,'account_no':this.data.account_no,'bank_name':this.data.bank_name,'account_holder_name':this.data.account_holder_name,'shipping_address':this.data.shipping_address,'check':this.data.check},'app_karigar/redeemRequest')
        .subscribe( (r) =>
        {
            this.loading.dismiss();
            console.log(r);

           
            if(r['status']=="SUCCESS")
            {
                this.navCtrl.setRoot(TabsPage,{index:'0'});
                // this.navCtrl.push(HomePage);
                this.showSuccess("Redeem Request Sent Successfully");
            }
            else if(r['status']=="EXIST")
            {
                this.showAlert(" Already Redeemed!");
            }
        });
    }
    showAlert(text) {
        let alert = this.alertCtrl.create({
            title:'Alert!',
            cssClass:'action-close',
            subTitle: text,
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            },
            {
                text:'OK',
                cssClass: 'close-action-sheet',
                handler:()=>{
                    // this.navCtrl.push(TransactionPage);
                }
            }]
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
    presentLoading() 
    {
        this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: false
        });
        this.loading.present();
    }
    ionViewDidLeave()
    {
        console.log('leave');
        this.dismiss()
    }
    
    myNumber()
    {
        console.log(this.data);
        if(this.data.check1==true)
        {
            this.data.shipping_address=this.karigar_detail.address + ' ,'+this.karigar_detail.city + ' ,'+this.karigar_detail.district +' ,'+ this.karigar_detail.state +' ,'+ this.karigar_detail.pincode;
        }
        else{
            this.data.shipping_address='';
        }
        
        
    }
    goRegestrationsPage=()=>{
        this.navCtrl.push(ProfilePage,{'data':this.karigar_detail,"mode":'redeem_page'})
    }
}

