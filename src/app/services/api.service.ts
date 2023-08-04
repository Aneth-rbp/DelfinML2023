import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public baseUrl = 'http://127.0.0.1:5000'; 

  constructor(private http: HttpClient) { }



  async processCSV(nombreArchivo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('nombre_archivo', nombreArchivo);
      this.http.post(`${this.baseUrl}/process_csv`, data).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  // ...
  
  async Result(result: any, id: number): Promise<any> {
    const url = `${this.baseUrl}/results/${id}`;
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    try {
      const response = await this.http.post(url, result, { headers }).toPromise();
      return response;
    } catch (error) {
      // Manejo del error
      console.error(error);
      throw error;
    }
  }
  


  // async Result(result: any, id:number): Promise<any> {
  //   let resultData = JSON.stringify(result);
  //   return new Promise((resolve, reject) => {
  //     this.http.post(`${this.baseUrl}/results/${id}`, resultData).subscribe(
  //       (response) => {
  //         resolve(response);
  //       },
  //       (error) => {
  //         reject(error);
  //       }
  //     );
  //   });
  // }

  async processData(nombreArchivo: string, id:number): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('nombre_archivo', nombreArchivo);
      this.http.post(`${this.baseUrl}/processData/${id}`, data).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async processTrainData(nombreArchivo: string, id:number): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('nombre_archivo', nombreArchivo);
      this.http.post(`${this.baseUrl}/processDataTrain/${id}`, data).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }


  createSignal(title :any, desc :any, saveOn :any, toCompare:any) {
    const signalData = {
      title: title,
      description: desc,
      saveOn: saveOn,
      toCompare: toCompare
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    this.http.post(`${this.baseUrl}/create-proyect`, signalData, httpOptions)
      .subscribe(
        (response) => {
          console.log(response); 
        },
        (error) => {
          console.error(error); 
        }
      );
  }

  
}

  
  

  
  
  