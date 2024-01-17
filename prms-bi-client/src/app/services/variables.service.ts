import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  processes: any[] = [
    { name: 'Azure Authentication', works: null },
    { name: 'PowerBI Platform', works: null },
    { name: 'Application Backend', works: null },
    { name: 'Embedded', works: null },
  ];
  constructor() {}
}
