import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ListboxModule } from 'primeng/listbox';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';

interface ListboxOption {
  label: string;
  value: number;
}

@Component({
  selector: 'assessment-developer-root',
  standalone: true,
  imports: [CommonModule, CardModule, MessageModule, ListboxModule, PaginatorModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: any = null;
  listboxOptions: ListboxOption[] = [];
  // For form
  newMessage: string = '';
  newItems: string = '';
  // For pagination
  messages: any[] = [];
  total: number = 0;
  page: number = 0; // PrimeNG paginator expects zero-based page index
  pageSize: number = 3;
  totalPages: number = 0; // Added totalPages to handle pagination
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.page = 0;  // Ensure we start with the first page
    this.loadMessages();
  }

  dummy = [
    {
        "id": 6,
        "message": "dasdadsasd",
        "items": ["33"],
        "score": 2
    },
    {
        "id": 5,
        "message": "dasdadsasd",
        "items": [
            "2"
        ],
        "score": 2

    },
    {
        "id": 4,
        "message": "dasdadsasd",
        "items": ["33"],
        "score": 2
    }
]

  loadMessages() {
    const pageNum = this.page + 1; // Convert zero-based page to one-based for the backend
    this.http.get<any>(`/api/messages?page=${pageNum}&limit=${this.pageSize}`).subscribe(
      res => {
        this.messages = res.data; // Assign paginated messages
        console.log(this.messages);
        
        this.total = res.total; // Update total message count
        this.page = res.page - 1; // Adjust page to zero-based index
        this.pageSize = res.pageSize; // Set the page size from the response
        this.totalPages = Math.ceil(res.total / this.pageSize); // Calculate total pages
      },
      error => {
        console.error('Error loading messages:', error);
      }
    );
  }

  onSubmit() {
    const itemsArr = this.newItems.split(',').map((i: string) => +i.trim()).filter((i: number) => !isNaN(i));
    this.http.post('/api/messages', { message: this.newMessage, items: itemsArr }).subscribe(
      () => {
        this.newMessage = '';
        this.newItems = '';
        this.page = 0; // Reset to first page after submit
        this.loadMessages(); // Reload messages after adding a new one
      },
      error => {
        console.error('Error submitting message:', error);
      }
    );
  }

  onPageChange(event: any) {
    this.page = event.page; // PrimeNG sends zero-based index
    this.pageSize = event.rows; // Set the new page size (rows per page)
    this.loadMessages(); // Reload messages when the page is changed
  }

  getListboxOptions(items: any[]): { label: string, value: any }[] {
    return Array.isArray(items) ? items.map(i => ({ label: String(i), value: i })) : [];
  }
}
