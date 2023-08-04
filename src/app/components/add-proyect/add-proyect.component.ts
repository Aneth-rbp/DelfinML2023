import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-proyect',
  templateUrl: './add-proyect.component.html',
  styleUrls: ['./add-proyect.component.scss'],
})
export class AddProyectComponent  implements OnInit {
  
  @Input() title: string = '';
  projectTitle: string = '';
  projectDescription: string = '';
  projectFilePath: string = '';
  projectFilePathCompare: string = '';

  constructor(private modalController: ModalController,
              private api : ApiService) {}

ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

  async submitForm() {
  await  this.api.createSignal(this.projectTitle, this.projectDescription, this.projectFilePath, this.projectFilePathCompare);
    this.modalController.dismiss();
  }

  formIsValid() {
    return this.projectTitle && this.projectDescription && this.projectFilePath;
  }

}

