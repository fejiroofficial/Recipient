import { Component, OnInit } from '@angular/core';
import { RecipientApi } from '../services/recipient-api.service';

interface Company {
  id: number;
  name: string;
}

interface RecipientList {
  name: string;
  companyRecipients: number[];
  emailRecipients: string[];
}

interface EmailRecipient {
  domain: string,
  recipients: string[]
}

interface CheckOptions {
  label: string;
  value: string;
  disabled: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private recipientApi: RecipientApi) { }

  companies: Company[] = [];
  selectedCompanies: string[] = []
  selectedEmailRecipients: object[] = []
  recipientList: object[] = [];
  inputValue: string = '';
  filteredOptions: string[] = [];
  options: string[] = [];
  checkOptions = []

  totalSelected(): number {
    const selectedCompanies = this.selectedCompanies.length
    const selectedEmails = this.selectedEmailRecipients.reduce((counter, email: EmailRecipient) => {
      email.recipients.forEach(() => {
        counter += 1
      })
      return counter
    }, 0)
    return selectedCompanies + selectedEmails
  }

  onChange(value: string): void {
    this.filteredOptions = this.options.filter(option => option.toLowerCase().indexOf(value.toLowerCase()) !== -1);
  }

  emailSubmissionHandler() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    const validEmail = emailRegex.test(this.inputValue)
    if (validEmail) {
      const domain = `@${this.inputValue.split("@")[1]}`
      const existingDomain = this.selectedEmailRecipients.find((r: EmailRecipient) => r.domain === domain)
      if (existingDomain) {
        this.selectedEmailRecipients = this.selectedEmailRecipients.map((r: EmailRecipient) => {
          if (r.domain === domain && !r.recipients.includes(this.inputValue)) {
            r.recipients.push(this.inputValue)
          }
          return r
        })
      } else {
        this.selectedEmailRecipients = [...this.selectedEmailRecipients, {
          domain,
          active: false,
          recipients: [this.inputValue]
        }]
      }
      // find and remove from options
      this.removeFromSearchOptions(this.inputValue)
    }
  }

  companySubmissionHandler() {
    if (this.options.includes(this.inputValue)) {
      this.selectedCompanies = [...this.selectedCompanies, this.inputValue]
      // find and remove from options
      this.removeFromSearchOptions(this.inputValue)
    }
  }

  onSubmit(): void {
    if (this.inputValue.includes('@')) {
      this.emailSubmissionHandler()
    } else {
      this.companySubmissionHandler()
    }
  }

  addToSearchOptions(value: string): void {
    // update search options
    this.options = [...this.options, value].sort()
  }

  removeFromSearchOptions(value: string): void {
    // update search options
    this.options = this.options.filter((option) => option !== value)
  }

  removeCompany(value): void {
    this.selectedCompanies = this.selectedCompanies.filter((option) => option !== value)
    this.addToSearchOptions(value)
  }

  removeRecipientGroup({ domain, recipients }) {
    // remove domain group recipients
    recipients.forEach(recipient => {
      this.removeRecipient(domain, recipient)
    });
    // remove domain group
    this.selectedEmailRecipients = this.selectedEmailRecipients.filter((option: EmailRecipient) => option.domain !== domain)
  }

  removeRecipient(domain, recipient) {
    this.selectedEmailRecipients = this.selectedEmailRecipients.map((option: EmailRecipient) => {
      if (option.domain === domain) {
        option.recipients = option.recipients.filter((o) => o !== recipient)
      }
      return option
    })
    this.addToSearchOptions(recipient)
  }

  deduping(data): string[] {
    // Ensuring no duplicates
    return data.filter((c, index) => {
      return data.indexOf(c) === index;
    });
  }

  getRecipients() {
    const recipients = []
    this.recipientList.forEach((recipient: RecipientList) => {
      recipient.emailRecipients.forEach((r: string) => recipients.push(r))
    })
    return recipients;
  }

  getCompanies() {
    return this.companies.map((company) => company.name)
  }

  processingSearchOptions(): string[] {
    const recipients = this.getRecipients()
    const companies = this.getCompanies()
    return this.deduping([...companies, ...recipients])
  }

  processingCheckOptions(): CheckOptions[] {
    return this.recipientList.map((r: RecipientList) => {
      return {
        label: r.name,
        value: r.name,
        disabled: true
      }
    })
  }

  ngOnInit(): void {
    this.recipientApi.getCompanies().subscribe(
      (listCompanies) => this.companies = listCompanies
    )
    this.recipientApi.getRecipientLists().subscribe(
      (listRecipients) => this.recipientList = listRecipients
    )
    this.options = this.processingSearchOptions()
    this.checkOptions = this.processingCheckOptions()
  }
}
