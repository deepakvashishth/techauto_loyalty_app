import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ConstantProvider {

  constructor(public http: Http) {
    console.log('Hello ConstantProvider Provider');
  }

  // Testing url

  public rootUrl: string = 'https://apps.abacusdesk.com/techauto/dd_api/';  
  public server_url: string = this.rootUrl + 'index.php/app/';
  public upload_url: string ='https://apps.abacusdesk.com/techauto/dd_api/app/uploads/';
  // public upload_url3: string ='https://apps.abacusdesk.com/techauto/dd_api/app/uploads/Org/';
  //   Live Url 
  public backButton = 0;

  
}
