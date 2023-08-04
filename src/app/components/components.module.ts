import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProyectComponent } from './add-proyect/add-proyect.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ResultsGraphicsComponent } from './results-graphics/results-graphics.component';
import { ResultsComponent } from './results/results.component';
import { GraphicsComponent } from './graphics/graphics.component';



@NgModule({
  declarations: [
    AddProyectComponent,
    ResultsGraphicsComponent,
    ResultsComponent,
    GraphicsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [
    ResultsGraphicsComponent,
    ResultsComponent,
    GraphicsComponent
  ]
})
export class ComponentsModule { }
