import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ModalController, NavController } from '@ionic/angular';
import { AddProyectComponent } from '../components/add-proyect/add-proyect.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

proyects: any = null;

  constructor(public api : ApiService,
    private modalController: ModalController,
    private http: HttpClient, 
    private navCtrl : NavController) {}

async ngOnInit() {
 await this.getProyects();
}

getProyects() {
  this.http.get(`${this.api.baseUrl}/proyects`).subscribe((response) => {
    this.proyects =  response;
   },(error) => {
     console.error(error); 
   });
}

DeleteProyect(id: any) {
  this.http.delete(`${this.api.baseUrl}/delete/${id}`).subscribe((response) => {
    this.getProyects();
   },(error) => {
     console.error(error); 
   });
}


async openModal() {
  const modal = await this.modalController.create({
    component: AddProyectComponent
  });
  await modal.present();
  modal.onWillDismiss().then((data)=>{
    setTimeout(() => {
      this.getProyects();
    }, 1000);
  });
}

GoToGraphic(i:number){
  let data = this.proyects[i];
  this.navCtrl.navigateForward('/graphics', {
    queryParams: {
       data : data
    }
  });
}


}
