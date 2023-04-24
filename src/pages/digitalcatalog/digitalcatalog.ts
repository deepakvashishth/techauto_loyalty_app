import { FileTransferObject } from '@ionic-native/file-transfer';
import { DbserviceProvider } from './../../providers/dbservice/dbservice';
import { ConstantProvider } from './../../providers/constant/constant';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
/**
 * Generated class for the DigitalcatalogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-digitalcatalog',
  templateUrl: 'digitalcatalog.html',
})
export class DigitalcatalogPage {
  pdf:any=[];
  uploadUrl:string='';
  tokenInfo: any;
  db: any;
  filter: any={};

  constructor(public navCtrl: NavController,private document: DocumentViewer,private transfer: FileTransferObject, public navParams: NavParams, private iab: InAppBrowser, public con:ConstantProvider, public dbService:DbserviceProvider) {
    this.uploadUrl = con.upload_url;
    this.getpdflist();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DigitalcatalogPage');
  }


  // openPdf(pdf) {
  //   console.log(pdf);
   
  //   this.iab.create(this.uploadUrl+pdf, '_system')
  // }

  openPdf(pdf) {
    console.log(pdf);
    let trim=pdf.replace(" "," ");
    console.log(trim)
    console.log(this.uploadUrl+pdf);
    console.log(this.uploadUrl+trim);
    const options: DocumentViewerOptions = {
      title: 'My Pdf'
    }
    
    // this.document.viewDocument(this.uploadUrl+trim, 'application/pdf', options)
    window.open(this.uploadUrl + trim, '_system', 'location=yes,closebuttoncaption=Fechar,enableViewportScale=yes');
    
  }

  // openPdf(pdf) {
  //   console.log(pdf);
  
  //   console.log(this.uploadUrl+pdf);
  //   const options: DocumentViewerOptions = {
  //     title: 'My Pdf'
  //   }
    
  //   this.document.viewDocument(this.uploadUrl+pdf, 'application/pdf', options)
    
  // }


  getpdflist()
  {
    this.filter.limit=0;
   this.dbService.post_rqst({"login_id":this.dbService.karigar_id,"filter":this.filter },"app_karigar/product_catalogue_list")
   .subscribe( r =>
     {
       console.log(r);
       this.pdf = r['pdf']
       }); 
     }



     flag:any='';
     loadData(infiniteScroll)
     {
         this.filter.limit=this.pdf.length;
         this.dbService.post_rqst({'filter' : this.filter,'login_id':this.dbService.karigar_id},'app_karigar/product_catalogue_list')
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
                     this.pdf=this.pdf.concat(r['pdf']);
                     console.log('Asyn operation has stop')
                     infiniteScroll.complete();
                 },1000);
             }
         });
     }










    
}
