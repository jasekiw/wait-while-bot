interface Config{
  confirm: boolean,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  targetTime?: {tomorrow: boolean, hour: number, minute: number},
  closeAfter: boolean
  beardTrim: boolean
  barberSelection: 'evan' | 'josh' | 'paul' | 'firstAvailable'
}
