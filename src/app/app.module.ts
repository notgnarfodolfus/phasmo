import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectorComponent } from './pages/selector/selector.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { TagSelectorComponent } from './components/tag-selector/tag-selector.component';
import { GhostSelectorComponent } from './components/ghost-selector/ghost-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectorComponent,
    CheckboxComponent,
    TagSelectorComponent,
    GhostSelectorComponent
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
