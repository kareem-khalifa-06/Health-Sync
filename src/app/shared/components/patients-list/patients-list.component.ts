import { PatientService } from './../../../core/services/patient.service';
import { Component, signal, inject } from '@angular/core';
import { BLOODGROUPS } from '../../../Data/bloodgroups';
import { ALL_CHRONIC_CONDITIONS } from '../../../Data/MEDICALCONDITIONS';
import { Patient } from '../../../models/patient';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.css',
})
export class PatientsListComponent {
  bloodGroups = BLOODGROUPS;
  patientsList=signal<Patient[]|null>(null)
  medicalConditons = ALL_CHRONIC_CONDITIONS;
pateientService= inject (PatientService);
  ngOnInit(){
     this.pateientService.getAllPatients().subscribe((res)=>{
        this.patientsList.set(res)
     })
  }
}
