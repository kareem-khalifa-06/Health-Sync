export interface Doctor {
      
      id: string,
      name: string,
      userId: string,
      specialization: string,
      qualifications: string[],
      experience: Number,
      consultationFee: Number,
      rating: Number,
      totalPatients: Number,
      about:string,
      availableDays: string[],
      availableTimeSlots: {
        start:string,
        end:string
      }[],
      languages: string[],
      achievements:string[]

}
