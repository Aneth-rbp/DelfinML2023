import { AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { ApiService } from '../../services/api.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.page.html',
  styleUrls: ['./graphics.page.scss'],
})
export class GraphicsPage implements AfterViewInit {
  
 
  labels:any;
  thereAreData: boolean = false;
  Verify: any = null;
  VerifyTrain: any = null;
  result: any;
  toUse: any = null;
  startTrain: number = 0;
  endTrain: number = 0;
  startTest: number = 0;
  endTest: number = 0;
  fileToSearch: any = null;
   electrodos: any[] =[
      {name: 'F3',
    i: 0},
      {name: 'AF3',
    i: 2},    
     {name: 'F7',
    i: 3},
     {name: 'FC5',
    i: 1},
      {name: 'T7',
    i: 4},
      {name: 'FC6',
    i: 12},
      {name: 'F4',
    i: 13},
      {name: 'F8',
    i: 10},
      {name: 'AF4',
    i: 11},
      {name: 'T8',
    i: 9},
      {name: 'P7',
    i: 5},
      {name: 'P8',
    i: 8},
      {name: 'O1',
    i: 6},
      {name: 'O2',
    i: 7}
   ]
   selectedElec: any = null;
  data: any ={
    path : null,
    y_train: [],
    x_test: null,
    y_test: []
  }
  id: any;
  testFile: any;
  trainFile: any;
  dataTrain: any[] = [];
  validTrain: any[] = [];
  dataTest: any[] = [];
  validTest: any[] = [];
  infoValidate: boolean = false;
  dataTrainToShow: any[] = []
  dataTestToShow: any[] = []
  loadingResult: boolean = false;

  constructor(private route: ActivatedRoute,
    private api :ApiService,
    private navCtrl: NavController, 
    private toastController: ToastController) {
      
    }

    
    
    async ngAfterViewInit() {
      const proyect = this.route.snapshot.queryParams['data'];
     await this.getTestData(proyect.saveOn)
     await this.getTrainData(proyect.toCompare)
     this.id = proyect.id;
     this.result = proyect.result;
     if (proyect.processOn != null && proyect.processCompare != null){
       await this.getTestDataProcess(proyect.processOn)
       await this.getTrainDataProcess(proyect.processCompare)
      }
      
    }

    hasDifferentValues(arr: number[][]): boolean {
      for (const innerArray of arr) {
        for (const value of innerArray) {
          if (value !== 0 && value !== 1) {
            return true;
          }
        }
      }
      return false;
    }

  getSubarray(arr: any[], start: number, end: number) {
    if (start < 0 || start >= arr.length || end < 0 || end >= arr.length) {
      this.toast('Índices inválidos. Asegúrate de que los valores estén dentro del rango de la gráfica.');
      return null
    }else return arr.slice(start, end + 1);
  }

  async getTestDataProcess(proyect:any){
    try {
      this.Verify = await this.api.processCSV(proyect);
    } catch (error) {
      console.error(error);
    }
  }
  async getTrainDataProcess(proyect:any){
    try {
      this.VerifyTrain = await this.api.processCSV(proyect);
    } catch (error) {
      console.error(error);
    }
  }

 async getTestData(proyect:any){
    try {
      this.testFile = await this.api.processCSV(proyect);
    } catch (error) {
      console.error(error);
    }
  }

  async getTrainData(proyect:any){
    try {
      this.trainFile = await this.api.processCSV(proyect);
    } catch (error) {
      console.error(error);
    }
  }

 async toast(message:string){
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async Process(){
    this.thereAreData = true;
    let response, res;
    try {
      response = await this.api.processData(this.route.snapshot.queryParams['data'].saveOn, this.route.snapshot.queryParams['data'].id);
      this.toast(response);
      res = await this.api.processTrainData(this.route.snapshot.queryParams['data'].toCompare, this.route.snapshot.queryParams['data'].id);
      this.toast(res);
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      console.error(error);
    }
  }

  obtenerObjetosSegunIndices(arregloOriginal: any[], indices: number[]): any[] {
    return indices.map(indice => (indice >= 0 && indice < arregloOriginal.length) ? arregloOriginal[indice] : null);
  }

  obtenerNombreElectrodo(elecIndex: number): string {
    const electrodo = this.electrodos.find(e => e.i === elecIndex);
    return electrodo ? electrodo.name : '';
  }

  async VerifyData(){
    this.dataTrain = [];
    this.dataTest = [];
    this.dataTrainToShow = [];
    this.dataTestToShow = [];
    this.validTest = [];
    this.validTrain = [];
    const testComplete = await this.obtenerObjetosSegunIndices(this.Verify, this.selectedElec);
   const trainComplete = await this.obtenerObjetosSegunIndices(this.VerifyTrain, this.selectedElec);
   if (testComplete != null && trainComplete) {
   for (let i = 0; i < testComplete.length; i++) {
    let testArray = this.getSubarray(testComplete[i], this.startTest, this.endTest)
    let trainArray = this.getSubarray(trainComplete[i], this.startTrain, this.endTrain)
    this.dataTrain.push(trainArray);
    this.dataTest.push(testArray);
    let dataToShow = {
      elec : this.obtenerNombreElectrodo(this.selectedElec[i]),
      data : trainArray
    }
    let dataTestShow = {
      elec : this.obtenerNombreElectrodo(this.selectedElec[i]),
      data : testArray
    }
    this.validTrain.push([]);
    this.validTest.push([]);
    for (let j = 0; j < this.dataTrain[i].length; j++) {
      this.validTrain[i].push(1)
    }
    for (let j = 0; j < this.dataTest[i].length; j++) {
      this.validTest[i].push(1)
    }
    this.dataTrainToShow.push(dataToShow);
    this.dataTestToShow.push(dataTestShow);
   }
   
   if ((this.dataTrain[0].length != this.dataTest[0].length) || (this.dataTrain[0].length == 0 && this.dataTest[0].length == 0)) this.toast('Se recomiendo que la extensión de ambos datos sea la misma')
   else this.infoValidate = true;
  }
}

async Results(){
  this.loadingResult = true;
  let data = {
    elec : this.selectedElec,
    x_test : this.dataTest,
    y_test :  this.validTrain,
    x_train : this.dataTrain,
    y_train : this.validTest
  }
  if(this.hasDifferentValues(this.validTest) == true || this.hasDifferentValues(this.validTrain) == true ) this.toast('Solo se pueden usar 1 y 0 para vavalidar los datos')
  else{
    try {
      let result = await this.api.Result(data, this.id);
      this.toast(result);
      this.loadingResult = false;
      this.navCtrl.navigateRoot('/home');
    } catch (error) {
      console.error(error);
      this.toast('Hubo un error al realizar el procesamiento')
      this.loadingResult = false;
    }
  }
  

  
  
}

}