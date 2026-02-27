import { Component, inject, signal } from '@angular/core';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Doctor } from '../../../models/doctor';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent {
private _DoctorsService=inject(DoctorsService) ;
doctorsList=signal<Doctor[]|null>(null)
ngOnInit(){
   this._DoctorsService.renderDoctors().subscribe({
    next:(res)=>{this.doctorsList.set(res)}})
}

}