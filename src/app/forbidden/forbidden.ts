import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-forbidden',
  imports: [    
    MatCardModule,
    MatButtonModule,
    MatIconModule, 
    RouterLink],
  templateUrl: './forbidden.html',
  styleUrl: './forbidden.scss',
})
export class Forbidden {

}
