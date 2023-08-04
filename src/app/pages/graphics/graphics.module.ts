import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphicsPageRoutingModule } from './graphics-routing.module';

import { GraphicsPage } from './graphics.page';
import { Chart } from 'chart.js';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphicsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GraphicsPage],
  providers: [ { provide: Chart, useValue: Chart }]
})
export class GraphicsPageModule {}
