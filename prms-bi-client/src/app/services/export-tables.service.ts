import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
interface Wscols {
  wpx: number;
}
@Injectable({
  providedIn: 'root',
})
export class ExportTablesService {
  constructor() {}
  exportExcel(list: any, fileName: string, wscols?: Wscols[]) {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(list, {
        skipHeader: true,
      });
      if (wscols) worksheet['!cols'] = wscols as any;
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, fileName);
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'text/csv;charset=UTF-8';
    let EXCEL_EXTENSION = '.csv';
    const data: Blob = new Blob(['\ufeff' + buffer], {
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
