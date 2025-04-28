import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component'; // Update according to your structure
import { MessageModule } from 'primeng/message';  // Import the MessageModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent, // Declare components here
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MessageModule,  // Add MessageModule here
    // Other necessary imports like FormsModule, HttpClientModule, etc.
  ],
  providers: [],
  bootstrap: [AppComponent]  // Your root component
})
export class AppModule { }
