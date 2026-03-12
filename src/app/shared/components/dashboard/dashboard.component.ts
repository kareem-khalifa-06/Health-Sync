import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { DoctorsService } from '../../../core/services/doctors.service';
import { PatientService } from '../../../core/services/patient.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(
    private _DoctorsService: DoctorsService,
    private _PatientService: PatientService,
    private _Router:Router
  ) {}
  doctorsCount!:number
  patientsCount!:number
  todayDate=dayjs().format('dddd,DD MMMM YYYY')
  ngOnInit(){
    this._DoctorsService.renderDoctors().subscribe((res)=>{
     this.doctorsCount=res.length
    })
    this._PatientService.getAllPatients().subscribe((res)=>{
     this.patientsCount=res.length
    })
  }
  viewAllDoctors(){
    this._Router.navigate(['adminLayout/doctors'])
  }
}
