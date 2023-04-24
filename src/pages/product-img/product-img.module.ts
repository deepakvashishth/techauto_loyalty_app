import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductImgPage } from './product-img';
import { createTranslateLoader } from '../offers/offers.module';

@NgModule({
  declarations: [
    ProductImgPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductImgPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
})
export class ProductImgPageModule {}
