import dayjs from "dayjs";
import { Doctor } from "../models/doctor";
 const todayDate = dayjs().format('dddd');
  
  export function handleDoctorAvailabilityStatus(doc: Doctor): boolean {
    return doc.availableDays.includes(todayDate);
  }