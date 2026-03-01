import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DoctorsService } from '../../../core/services/doctors.service';
import { Doctor } from '../../../models/doctor';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css',
})
export class DoctorsListComponent {
  private _DoctorsService = inject(DoctorsService);
  private destroyRef = inject(DestroyRef);
  todayDate = dayjs().format('dddd');

  searchQuery = '';
  statusFilter = '';
  doctorsList = signal<Doctor[] | null>(null);
  filteredDoctors = signal<Doctor[] | null>(null);
  renderDoctors(){
    const sub = this._DoctorsService.renderDoctors().subscribe({
      next: (res) => {
        this.doctorsList.set(res);
        this.filteredDoctors.set(res);
        this.searchQuery='';
        this.statusFilter='All';
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  ngOnInit() {
    this.renderDoctors();
  }

  onSearch(query: string) {
    if (!query.trim()) {
      this.filteredDoctors.set(this.doctorsList());
      return;
    }
    this.filteredDoctors.set(
      this.doctorsList()?.filter((doc) =>
        doc.name.toLowerCase().includes(query.toLowerCase()),
      ) ?? null,
    );
  }
  onFilter(query:string){
     if (!query.trim()||query==='all') {
       this.filteredDoctors.set(this.doctorsList());
       return;
     }
     this.filteredDoctors.set(
      this.doctorsList()?.filter((doc)=>
        query==='available'?this.handleDoctorAvailabilityStatus(doc):!this.handleDoctorAvailabilityStatus(doc)
      )??null
     )
    
  }
  handleDoctorAvailabilityStatus(doc: Doctor): boolean {
    return doc.availableDays.includes(this.todayDate);
  }
  onDelete(id:string){
    this._DoctorsService.deleteDoctor(id).subscribe({
      next:()=>{
        this.renderDoctors()
      }
    });
  }
}
