import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  processes: any[] = [
    { name: 'Azure Authentication', works: false },
    { name: 'PowerBI Platform', works: false },
    { name: 'Application Backend', works: false },
    { name: 'Embedded', works: false },
  ];
  constructor() {}
}
