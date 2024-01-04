import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as csv from 'csvtojson';
interface Wscols {
  wpx: number;
}
@Injectable({
  providedIn: 'root',
})
export class ExportTablesService {
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
          array = data;
          array.forEach((row: any, i: any) => {
            if (i == 0) return;
            let obj: any = {};
            row.forEach((col: any, j: any) => {
              obj[array[0][j]] = array[i][j];
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
}
