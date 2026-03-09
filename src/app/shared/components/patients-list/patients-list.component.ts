import { PatientService } from './../../../core/services/patient.service';
import { Component, signal, inject } from '@angular/core';
import { BLOODGROUPS } from '../../../Data/bloodgroups';
import { ALL_CHRONIC_CONDITIONS } from '../../../Data/MEDICALCONDITIONS';
import { Patient } from '../../../models/patient';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent {
  bloodGroups = BLOODGROUPS;
  patientsList = signal<Patient[] | null>(null);
  filteredPatientsList = signal<Patient[] | null>(this.patientsList());
  medicalConditons = ALL_CHRONIC_CONDITIONS;
  searchQuery = '';
  conditionFilter = '';
  bloodGroupFilter = 'All';
  pateientService = inject(PatientService);
  ngOnInit() {
    this.pateientService.getAllPatients().subscribe((res) => {
      this.patientsList.set(res);
      this.filteredPatientsList.set(res);
      this.searchQuery = '';
      this.bloodGroupFilter = 'All';
      this.conditionFilter = 'All';
    });
  }
  calculateAge(dob: string | Date): number {
    const birthDate = new Date(dob);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  onSearch(search: string) {
    this.searchQuery = search;
    console.log('khadija');
    this.applyFilters();
  }
  onConditionFilter(query: string) {
    this.conditionFilter = query;
    this.applyFilters();
  }
  onBloodGroupFilter(query: string) {
    this.bloodGroupFilter = query;
    console.log(query)
    this.applyFilters();
  }
  applyFilters() {
    let patients = this.patientsList() ?? [];

    // search filter
    if (this.searchQuery.trim()) {
      patients = patients.filter((patient) =>
        patient.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    //blood group filter
    if(this.bloodGroupFilter!=='All'){
      patients=patients.filter((p)=>{
      return  p.bloodGroup.toLowerCase()===this.bloodGroupFilter.toLowerCase();
      })
    }
    // medical coddition filter
     if (this.conditionFilter !== 'All') {
       patients = patients.filter((p) => {
         return p.chronicConditions.includes(this.conditionFilter)
       });
     }

    this.filteredPatientsList.set(patients);
  }
}
