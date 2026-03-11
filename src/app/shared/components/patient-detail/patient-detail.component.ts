import { ActivatedRoute, RouterLink } from '@angular/router';
import { Component, inject, input } from '@angular/core';
import { Patient } from '../../../models/patient';
import { PatientService } from '../../../core/services/patient.service';
import { calculateAge } from '../../../utils/calculateAge';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css',
})
export class PatientDetailComponent {
  patient!:Patient
  calculateAge=calculateAge
  constructor( private _activatedRoute :ActivatedRoute,
    private _patientservice:PatientService
  ){

  }
  
  ngOnInit() {
   const id= this._activatedRoute.snapshot.paramMap.get('id');
    const sub= this._patientservice.getPatientById(id!).subscribe({
      next:(r)=>this.patient=r
    })
  }

}
