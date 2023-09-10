import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IndexPageComponent } from './pages/index/index.component';
import { FootstepPageComponent } from './pages/footstep/footstep.component';
import { CheckBoxComponent } from './components/check/check-box/check-box.component';
import { CheckBoxChoiceComponent } from './components/check/check-box-choice/check-box-choice.component';
import { CheckLabelComponent } from './components/check/check-label/check-label.component';
import { GhostSelectComponent } from './components/ghost-select/ghost-select.component';
import { EvidenceSelectComponent } from './components/evidence-select/evidence-select.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexPageComponent,
    FootstepPageComponent,
    CheckBoxComponent,
    CheckBoxChoiceComponent,
    CheckLabelComponent,
    GhostSelectComponent,
    EvidenceSelectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
