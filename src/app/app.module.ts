import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OpenlayersMapComponent } from './openlayers-map.component'


@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, OpenlayersMapComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { 

}
