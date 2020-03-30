import { Injectable } from '@angular/core';

@Injectable()
export class JsonToCsvService {
  downloadFile(data, headerList: string[], filename = 'data') {
    let csvData = this.ConvertToCSV(data, headerList);
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList: string[]) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = ''; for (let index in headerList) {
      row += '\"' + headerList[index] + '\"' + ','
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let k = 0; k < headerList.length; k++) {
        line += '\"' + Object.values(array[i])[k] + '\"' + ','
      }
      line = line.slice(0, -1);
      str += line + '\r\n';
    }
    return str;
  }
}
