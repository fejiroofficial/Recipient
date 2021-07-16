import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class RecipientApi {

  private recipientLists: RecipientList[] = [
    {
      name: 'minimalRecipientList1',
      companyRecipients: [2, 3, 4],
      emailRecipients: [ 'foo@enmacc.de', 'bar@enmacc.de', 'foo@not-enmacc.de' ]
    },
    {
      name: 'minimalRecipientList2',
      companyRecipients: [2, 4, 5],
      emailRecipients: [ 'foo@not-enmacc.de', 'bar@not-enmacc.de', 'foo@not-enmacc.de' ]
    }
  ];

  private companies: Company[] = [
    { id: 1, name: 'compName1' },
    { id: 2, name: 'compName2' },
    { id: 3, name: 'compName3' },
    { id: 4, name: 'compName4' },
    { id: 5, name: 'compName5' },
    { id: 6, name: 'compName6' },
    { id: 7, name: 'compName7' },
    { id: 8, name: 'compName8' },
    { id: 9, name: 'compName9' },
  ];

  public getRecipientLists(): Observable<RecipientList[]> {
    return of(this.recipientLists);
  }

  public getCompanies(): Observable<Company[]> {
    return of(this.companies);
  }

}

export interface RecipientList {
  name: string;
  companyRecipients: number[];
  emailRecipients: string[];
}

export interface Company {
  id: number;
  name: string;
}
