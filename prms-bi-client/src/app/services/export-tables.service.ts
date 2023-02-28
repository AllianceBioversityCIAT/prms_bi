import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as csv from 'csvtojson';
// declare var csv: any;
interface Wscols {
  wpx: number;
}
@Injectable({
  providedIn: 'root',
})
export class ExportTablesService {
  constructor() {}

  async localCsvToJson(csvText: string) {
    return new Promise((resolve, reject) => {
      console.clear();
      let list: any[] = [];
      let array: any;
      csv({
        noheader: true,
        output: 'csv',
      })
        .fromString(csvText)
        .then((data: any) => {
          console.log(data);
          console.log(data?.length);
          array = data;

          console.log('end');

          array.forEach((row: any, i: any) => {
            // console.log('- -- - - - row - - - - -');
            // console.log(row);
            if (i == 0) return;
            let obj: any = {};
            row.forEach((col: any, j: any) => {
              // console.log('- -- - - - col - - - - -');
              obj[array[0][j]] = array[i][j];
              // for (const key in list) {
              // }
            });
            list.push(obj);
          });

          resolve(list);
        });
    });
  }

  async exportExcel(csvText: any, fileName: string, wscols?: Wscols[]) {
    this.localCsvToJson(csvText).then((list: any) => {
      try {
        import('xlsx').then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(list, {
            skipHeader: Boolean(wscols?.length),
          });
          if (wscols) worksheet['!cols'] = wscols as any;
          const workbook = {
            Sheets: { data: worksheet },
            SheetNames: ['data'],
          };
          const excelBuffer: any = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
          });
          this.saveAsExcelFile(excelBuffer, fileName);
        });
      } catch (error) {
        console.log(error);
        // this.customAlertService.show({ id: 'loginAlert', title: 'Oops!', description: 'Erorr generating file', status: 'error' });
      }
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  // saveCsv(data: any) {
  //   const BOM = '\uFEFF';

  //   // var blob = new Blob([data], { type: 'text/plain;charset=UTF-8-BOM' });
  //   // FileSaver.saveAs(blob, 'yourcsv.csv');
  //   const blob = new Blob([BOM + data], { type: 'text/csv;charset=UTF-8' });

  //   // Creating an object for downloading url
  //   const url = window.URL.createObjectURL(blob);

  //   // Creating an anchor(a) tag of HTML
  //   const a = document.createElement('a');

  //   // Passing the blob downloading url
  //   a.setAttribute('href', url);

  //   // Setting the anchor tag attribute for downloading
  //   // and passing the download file name
  //   a.setAttribute('download', 'download.csv');

  //   // Performing a download with click
  //   a.click();
  // }
}
