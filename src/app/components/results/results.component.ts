import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent  implements OnInit {

  @Input() result: any;
  // resultSelected: number = 0;
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
 infoToShow: any[] = [];

  constructor() { }

  obtenerNombreElectrodo(elecIndex: number): string {
    const electrodo = this.electrodos.find(e => e.i === elecIndex);
    return electrodo ? electrodo.name : '';
  }


  ngOnInit() {
    const jsonObject = JSON.parse(this.result);
    console.log(jsonObject);
    for (let i = 0; i < jsonObject.elec.length; i++) {
      let data = {
        name: this.obtenerNombreElectrodo(jsonObject.elec[i]),
        data: jsonObject.predictions[i]
      };
      this.infoToShow.push(data);
    }
  
    // if(this.result <= 0.5 ) this.resultSelected = 1;
    // if(this.result >= 0.6 && this.result <= 0.8) this.resultSelected = 2;
    // if(this.result >= 0.9) this.resultSelected = 3;
    // console.log(this.resultSelected);
    


  }

}
