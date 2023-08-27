import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GhostPickerComponent } from './components/ghost-picker/ghost-picker.component';
import { SelectorComponent } from './pages/selector/selector.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [
    AppComponent,
    GhostPickerComponent,
    SelectorComponent,
    CheckboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
