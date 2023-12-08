import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, Loading, ModalController  } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { TabsPage } from './../../../pages/tabs/tabs';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AboutusModalPage} from '../../aboutus-modal/aboutus-modal'
import { Storage } from '@ionic/storage';
import { Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../../home/home';
import { ConstantProvider } from '../../../providers/constant/constant';


@IonicPage()
@Component({
    selector: 'page-registration',
    templateUrl: 'registration.html',
})
export class RegistrationPage {
    @ViewChild(Content) content: Content;
    data:any={};
    state_list:any=[];
    district_list:any=[];
    city_list:any=[];
    pincode_list:any=[];
    selectedFile:any=[];
    file_name:any=[];
    karigar_id:any='';
    formData= new FormData();
    myphoto:any;
    profile_data:any='';
    loading:Loading;
    lang:any='';
    today_date:any;
    uploadurl: any = "";
    mode:string='';

    
    constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider,public alertCtrl:AlertController ,public actionSheetController: ActionSheetController,private camera: Camera,private loadingCtrl:LoadingController,private transfer: FileTransfer,public modalCtrl: ModalController,private storage:Storage,public translate:TranslateService, public constant:ConstantProvider) {
        this.uploadurl = this.constant.upload_url;
        this.data.mobile_no = this.navParams.get('mobile_no');
        this.data.document_type='Aadharcard';
        this.mode = navParams.get('mode')
        this.data.profile='';
        this.data.document_image='';
        this.data.document_image_back='';
        this.data.cheque_image='';
        


        this.data.user_type=1;
        this.getstatelist();
        this.today_date = new Date().toISOString().slice(0,10);

        if(navParams.data.data){
            this.data = navParams.data.data;
            console.log( this.data);

            if(this.data.dob == '0000-00-00'){
                this.data.dob = '';
            }

            this.data.karigar_edit_id = this.data.id;
            this.data.profile_edit_id = this.data.id;
            this.data.doc_edit_id = this.data.id;
            this.data.doc_back_edit_id = this.data.id;
            this.data.cheque_image_id = this.data.id;


            // this.data.profile= this.data.profile;
            // this.data.document_image = this.data.document_image
            // this.data.document_image_back = this.data.document_image_back
            // this.data.cheque_image = this.data.cheque_image
        }

        console.log(this.data.karigar_edit_id);
        
    }
    
    cam:any="";
    gal:any="";
    cancl:any="";
    ok:any="";
    upl_file:any="";
    save_succ:any="";
    ionViewDidLoad() {

        this.translate.setDefaultLang(this.lang);
        this.translate.use(this.lang);
        if (this.data.state) {
            this.getDistrictList(this.data.state);
          }
        console.log(this.data);
        this.translate.get("Camera")
        .subscribe(resp=>{
            this.cam = resp
        });
        
        this.translate.get("Gallery")
        .subscribe(resp=>{
            this.gal = resp
        });
        
        this.translate.get("Cancel")
        .subscribe(resp=>{
            this.cancl = resp
        });
        
        this.translate.get("OK")
        .subscribe(resp=>{
            this.ok = resp
        });
        
        this.translate.get("Upload File")
        .subscribe(resp=>{
            this.upl_file = resp
        });
        
        this.translate.get("Registered Successfully")
        .subscribe(resp=>{
            this.save_succ = resp
        });
    }
    
    getstatelist(){
        this.service.get_rqst('app_master/getStates').subscribe( r =>
            {
                console.log(r);
                this.state_list=r['states'];
                this.karigar_id=r['id'];
                console.log(this.state_list);
            });
        }
        getDistrictList(state_name)
        {
            console.log(state_name);
            this.service.post_rqst({'state_name':state_name},'app_master/getDistrict')
            .subscribe( (r) =>
            {
                console.log(r);
                this.district_list=r['districts'];
                console.log(this.state_list);
            });
        }
        
        getCityList(district_name)
        {
            console.log(district_name);
            this.service.post_rqst({'district_name':district_name},'app_master/getCity')
            .subscribe( (r) =>
            {
                console.log(r);
                this.city_list=r['cities'];
                this.pincode_list=r['pins'];
                console.log(this.pincode_list);
            });
        }
        
        getaddress(pincode)
        {
            if(this.data.pincode.length=='6')
            {
                this.service.post_rqst({'pincode':pincode},'app_karigar/getAddress')
                .subscribe( (result) =>
                {
                    console.log(result);
                    var address = result.address;
                    if(address!= null)
                    {
                        this.data.state = result.address.state_name;
                        this.getDistrictList(this.data.state)
                        this.data.district = result.address.district_name;
                        this.data.city = result.address.city;
                        console.log(this.data);
                    }
                });
            }
            
        }
        
        scrollUp()
        {
            this.content.scrollToTop();
        }  
        
        submit()
        {
            // if(this.data.document_image == '')
            // {

            //    this.translate.get("Upload Document Is Required!")
            //    .subscribe(resp=>{
            //        this.showAlert(resp);
            //    });
            //    return;
            // }

            // if(this.data.cheque_image == '')
            // {

            //    this.translate.get("Upload Bank Image Is Required!")
            //    .subscribe(resp=>{
            //        this.showAlert(resp);
            //    });
            //    return;
            // }

            this.presentLoading();
            console.log('data');
            console.log(this.data);
          
            
            if(this.data.dealer_counter_name)
            {
                this.data.dealer_status='Active';
                console.log(this.data.dealer_status);
            }
            else
            {
                this.data.dealer_status='';
            }
            this.data.lang = this.lang;
            this.service.post_rqst( {'karigar': this.data },'app_karigar/addKarigar')
            .subscribe( (r) =>
            {
                console.log(r);
                this.loading.dismiss();
                this.karigar_id=r['id'];
                console.log(this.karigar_id);


            // if(r['status']=="SUCCESS")
            // {
            //     this.showAlert(r['text_msg']);
            //     return;
            // }
                
                if(r['status']=="SUCCESS")
                {
                    this.showSuccess(r['text_msg']);
                    this.service.post_rqst({'mobile_no': this.data.mobile_no ,'mode' :'App'},'auth/login')
                    .subscribe( (r) =>
                    {
                        console.log(r);
                        if(r['status'] == 'NOT FOUND')
                        {
                            return;
                        } 
                        else if(r['status'] == 'ACCOUNT SUSPENDED')
                        {
                            this.translate.get("Your account has been suspended")
                            .subscribe(resp=>{
                                this.showAlert(resp);
                            })
                            return;
                        }
                        else if(r['status'] == 'SUCCESS')
                        {
                            this.storage.set('token',r['token']); 
                            this.service.karigar_id=r['user'].id;
                            this.service.karigar_status=r['user'].status;
                            console.log(this.service.karigar_id);
                            
                            if(r['user'].status !='Verified')
                            {
                                let contactModal = this.modalCtrl.create(AboutusModalPage);
                                contactModal.present();
                                return;
                            }
                        }


                       
                        
                        this.navCtrl.push(TabsPage);
                        // this.navCtrl.push(HomePage);
                    });
                }
                // else if(r['status']=="UPDATE")
                // {
                //     this.showSuccess("Profile update Successfully!");
                   

                // }
                else if(r['status']=="UPDATE")
                {
                    this.translate.get("Profile update Successfully")
                    .subscribe(resp=>{
                        this.showSuccess(resp+"!");
                    });
                        this.navCtrl.push(HomePage);
                    
                }


                else if(r['status']=="EXIST")
                {
                    this.translate.get("Already Registered")
                    .subscribe(resp=>{
                        this.showAlert(resp+"!");
                    })
                }


              


            });
        }
        namecheck(event: any) 
        {
            console.log("called");
            
            const pattern = /[A-Z\+\-\a-z ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) 
            {event.preventDefault(); }
        }
        
        caps_add(add:any)
        {
            this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
        }
        
        showSuccess(text)
        {
            this.translate.get("Success")
            .subscribe(resp=>{
                let alert = this.alertCtrl.create({
                    title:resp+'!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: ['OK']
                });
                alert.present();
            })
        }
        showAlert(text) 
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
        
        openeditprofile()
        {
            let actionsheet = this.actionSheetController.create({
                title:"Profile photo",
                cssClass: 'cs-actionsheet',
                
                buttons:[{
                    cssClass: 'sheet-m',
                    text: this.cam,
                    icon:'camera',
                    handler: () => {
                        console.log("Camera Clicked");
                        this.takePhoto();
                    }
                },
                {
                    cssClass: 'sheet-m1',
                    text: this.gal,
                    icon:'image',
                    handler: () => {
                        console.log("Gallery Clicked");
                        this.getImage();
                    }
                },
                {
                    cssClass: 'cs-cancel',
                    text: this.cancl,
                    role: 'cancel',
                    handler: () => {
                        this.data.profile_edit_id = this.data.id;
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionsheet.present();
    }
    takePhoto()
    {
        console.log("i am in camera function");
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400,
            cameraDirection: 1,
            correctOrientation: true
        }
        
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.data.profile_edit_id = '';
            this.data.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.profile);
        }, (err) => {
        });
    }
    getImage() 
    {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.data.profile_edit_id = '';
            this.data.profile = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.profile);
        }, (err) => {
        });
    }
    
    flag:boolean=true;  
    
    onUploadChange(evt: any) {
        let actionsheet = this.actionSheetController.create({
            title:'Upload File',
            cssClass: 'cs-actionsheet',
            
            buttons:[{
                cssClass: 'sheet-m',
                text: 'Camera',
                icon:'camera',
                handler: () => {
                    console.log("Camera Clicked");
                    this.takeDocPhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: 'Gallery',
                icon:'image',
                handler: () => {
                    console.log("Gallery Clicked");
                    this.getDocImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.data.doc_edit_id = this.data.id;
                    console.log('Cancel clicked');
                }
            }
        ]
    });
    actionsheet.present();
}
takeDocPhoto()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_edit_id='',
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}
getDocImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.doc_edit_id='',
        this.data.document_image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.document_image);
    }, (err) => {
    });
}




onUploadCard(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:this.upl_file,
        cssClass: 'cs-actionsheet',
        
        buttons:[{
            cssClass: 'sheet-m',
            text: this.cam,
            icon:'camera',
            handler: () => {
                console.log("Camera Clicked");
                this.takeCardPhoto();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: this.gal,
            icon:'image',
            handler: () => {
                console.log("Gallery Clicked");
                this.getCardImage();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: this.cancl,
            role: 'cancel',
            handler: () => {
                console.log('Cancel clicked');
            }
        }
    ]
});
actionsheet.present();
}
takeCardPhoto()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.visiting_card = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.visiting_card);
    }, (err) => {
    });
}
getCardImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.flag=false;
        this.data.visiting_card = 'data:image/jpeg;base64,' + imageData;
        console.log(this.data.visiting_card);
    }, (err) => {
    });
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

MobileNumber(event: any) 
{
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
}












onUploadBank(evt: any) {
    let actionsheet = this.actionSheetController.create({
        title:'Upload File',
        cssClass: 'cs-actionsheet',
        
        buttons:[{
            cssClass: 'sheet-m',
            text: 'Camera',
            icon:'camera',
            handler: () => {
                console.log("Camera Clicked");
                this.takeDocPhotoBank();
            }
        },
        {
            cssClass: 'sheet-m1',
            text: 'Gallery',
            icon:'image',
            handler: () => {
                console.log("Gallery Clicked");
                this.getDocImagebank();
            }
        },
        {
            cssClass: 'cs-cancel',
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
                this.data.doc_edit_id = this.data.id;
                console.log('Cancel clicked');
            }
        }
    ]
});
actionsheet.present();
}
takeDocPhotoBank()
{
console.log("i am in camera function");
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    targetWidth : 500,
    targetHeight : 400
}

console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.doc_edit_id='',
    this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.cheque_image);
}, (err) => {
});
}
getDocImagebank()
{
const options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    saveToPhotoAlbum:false
}
console.log(options);
this.camera.getPicture(options).then((imageData) => {
    this.flag=false;
    this.data.doc_edit_id='',
    this.data.cheque_image = 'data:image/jpeg;base64,' + imageData;
    console.log(this.data.cheque_image);
}, (err) => {
});
}







}
