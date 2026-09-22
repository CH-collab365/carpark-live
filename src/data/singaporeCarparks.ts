import { Carpark } from '../types';

export const INITIAL_CARPARKS: Carpark[] = [
  // Marina Bay & Downtown
  {
    id: 'mbs-carpark',
    code: 'MBS01',
    name: 'Marina Bay Sands Integrated Resort',
    address: '10 Bayfront Ave, Basement 3 & 4',
    area: 'Marina Bay',
    agency: 'Commercial',
    lat: 1.2838,
    lng: 103.8591,
    totalLots: 2490,
    availableLots: 382,
    lotTypes: {
      car: { total: 2400, available: 370 },
      motorcycle: { total: 90, available: 12 }
    },
    rates: {
      weekdayDay: '$8.00 1st hour, $1.50/next 30 mins (07:00 - 19:00)',
      weekdayNight: '$8.00 per entry (19:00 - 07:00)',
      saturday: '$10.00 1st hr, $2.00/next 30 mins',
      sundayPH: '$10.00 1st hr, $2.00/next 30 mins',
      gracePeriodMins: 10,
      freeParkingNote: 'Complimentary with Sands Rewards Lifestyle Tier or $150 spend'
    },
    heightLimitM: 2.0,
    hasEVCharging: true,
    evChargerCount: 16,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '1 min ago'
  },
  {
    id: 'suntec-city',
    code: 'SC01',
    name: 'Suntec City Mall Carpark',
    address: '3 Temasek Blvd, Basement 1 & Multi-Storey',
    area: 'Marina Bay',
    agency: 'Commercial',
    lat: 1.2935,
    lng: 103.8572,
    totalLots: 3100,
    availableLots: 845,
    lotTypes: {
      car: { total: 2950, available: 810 },
      motorcycle: { total: 150, available: 35 }
    },
    rates: {
      weekdayDay: '$2.40 for 1st hour, $0.60/subsequent 15 mins (07:00 - 17:00)',
      weekdayNight: '$3.30 per entry (17:00 - 07:00)',
      saturday: '$2.60 for 1st 4 hours, $0.60/subsequent 15 mins',
      sundayPH: '$2.60 for 1st 4 hours, $0.60/subsequent 15 mins',
      gracePeriodMins: 15,
      freeParkingNote: 'Free parking coupon with min. $50 spend at Suntec City'
    },
    heightLimitM: 2.0,
    hasEVCharging: true,
    evChargerCount: 22,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  },
  {
    id: 'raffles-city',
    code: 'RC01',
    name: 'Raffles City Shopping Centre',
    address: '252 North Bridge Rd, Basement 2 & 3',
    area: 'CBD / Downtown',
    agency: 'Commercial',
    lat: 1.2938,
    lng: 103.8532,
    totalLots: 1045,
    availableLots: 118,
    lotTypes: {
      car: { total: 980, available: 110 },
      motorcycle: { total: 65, available: 8 }
    },
    rates: {
      weekdayDay: '$3.30 for 1st hour, $0.65/subsequent 15 mins (08:00 - 18:00)',
      weekdayNight: '$3.50 per entry (18:00 - 08:00)',
      saturday: '$3.50 for 1st 2 hours, $0.70/subsequent 15 mins',
      sundayPH: '$3.50 for 1st 2 hours, $0.70/subsequent 15 mins',
      gracePeriodMins: 10
    },
    heightLimitM: 1.9,
    hasEVCharging: true,
    evChargerCount: 8,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '2 mins ago'
  },
  {
    id: 'ura-marina-bay',
    code: 'URA-MB',
    name: 'URA Bayfront Open Surface Carpark',
    address: 'Bayfront Ave (Opposite Bayfront MRT)',
    area: 'Marina Bay',
    agency: 'URA',
    lat: 1.2815,
    lng: 103.8564,
    totalLots: 280,
    availableLots: 42,
    lotTypes: {
      car: { total: 260, available: 38 },
      motorcycle: { total: 20, available: 4 }
    },
    rates: {
      weekdayDay: '$1.20 per 30 mins (07:00 - 17:00)',
      weekdayNight: '$0.60 per 30 mins (max $5.00/night)',
      saturday: '$1.20 per 30 mins (07:00 - 17:00)',
      sundayPH: '$0.60 per 30 mins (07:00 - 22:30)',
      gracePeriodMins: 15
    },
    heightLimitM: 4.5,
    hasEVCharging: false,
    isSheltered: false,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '4 mins ago'
  },

  // Orchard & Somerset
  {
    id: 'ion-orchard',
    code: 'ION01',
    name: 'ION Orchard Carpark',
    address: '2 Orchard Turn, Basement 5 & 6',
    area: 'Orchard',
    agency: 'Commercial',
    lat: 1.3040,
    lng: 103.8318,
    totalLots: 650,
    availableLots: 56,
    lotTypes: {
      car: { total: 600, available: 52 },
      motorcycle: { total: 50, available: 4 }
    },
    rates: {
      weekdayDay: '$3.00 for 1st hour, $0.75/next 15 mins (08:00 - 17:00)',
      weekdayNight: '$4.00 per entry (17:00 - 23:59)',
      saturday: '$4.20 for 1st hr, $0.90/next 15 mins',
      sundayPH: '$4.20 for 1st hr, $0.90/next 15 mins',
      gracePeriodMins: 10,
      freeParkingNote: 'ION Rewards Member 1 hr free with $100 spending'
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 10,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '1 min ago'
  },
  {
    id: 'ngee-ann-city',
    code: 'NAC01',
    name: 'Ngee Ann City (Takashimaya)',
    address: '391 Orchard Rd, Basement 2 & 3',
    area: 'Orchard',
    agency: 'Commercial',
    lat: 1.3025,
    lng: 103.8344,
    totalLots: 1200,
    availableLots: 145,
    lotTypes: {
      car: { total: 1150, available: 139 },
      motorcycle: { total: 50, available: 6 }
    },
    rates: {
      weekdayDay: '$3.20 for 1st hour, $0.80/next 15 mins (08:00 - 17:00)',
      weekdayNight: '$4.50 per entry (17:00 - 08:00)',
      saturday: '$3.50 for 1st hour, $0.80/next 15 mins',
      sundayPH: '$3.50 for 1st hour, $0.80/next 15 mins',
      gracePeriodMins: 10
    },
    heightLimitM: 2.0,
    hasEVCharging: true,
    evChargerCount: 6,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '3 mins ago'
  },
  {
    id: 'somerset-313',
    code: '313S',
    name: '313@somerset Carpark',
    address: '313 Orchard Rd, Basement 4',
    area: 'Orchard',
    agency: 'Commercial',
    lat: 1.3011,
    lng: 103.8384,
    totalLots: 420,
    availableLots: 18,
    lotTypes: {
      car: { total: 390, available: 16 },
      motorcycle: { total: 30, available: 2 }
    },
    rates: {
      weekdayDay: '$3.00 for 1st hour, $0.75/next 15 mins',
      weekdayNight: '$3.50 per entry (18:00 - 06:00)',
      saturday: '$3.50 1st hour, $0.85/next 15 mins',
      sundayPH: '$3.50 1st hour, $0.85/next 15 mins',
      gracePeriodMins: 10
    },
    heightLimitM: 1.95,
    hasEVCharging: true,
    evChargerCount: 4,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  },
  {
    id: 'plaza-singapura',
    code: 'PS01',
    name: 'Plaza Singapura Carpark',
    address: '68 Orchard Rd, Multi-Storey Levels 4-7',
    area: 'Orchard',
    agency: 'Commercial',
    lat: 1.3007,
    lng: 103.8447,
    totalLots: 730,
    availableLots: 215,
    lotTypes: {
      car: { total: 690, available: 200 },
      motorcycle: { total: 40, available: 15 }
    },
    rates: {
      weekdayDay: '$2.50 for 1st hour, $0.60/next 15 mins (00:00 - 17:59)',
      weekdayNight: '$3.50 per entry (18:00 - 23:59)',
      saturday: '$3.20 for 1st 2 hours, $0.60/next 15 mins',
      sundayPH: '$3.20 for 1st 2 hours, $0.60/next 15 mins',
      gracePeriodMins: 15,
      freeParkingNote: 'Free weekday lunchtime parking (12:00 - 14:00) with $30 spend'
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 12,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '1 min ago'
  },

  // Bugis & City Hall
  {
    id: 'bugis-junction',
    code: 'BJ01',
    name: 'Bugis Junction Carpark',
    address: '200 Victoria St, Basement 1 & 2',
    area: 'Bugis',
    agency: 'Commercial',
    lat: 1.2998,
    lng: 103.8553,
    totalLots: 680,
    availableLots: 89,
    lotTypes: {
      car: { total: 640, available: 82 },
      motorcycle: { total: 40, available: 7 }
    },
    rates: {
      weekdayDay: '$2.50 for 1st hour, $0.60/next 15 mins (08:00 - 18:00)',
      weekdayNight: '$3.30 per entry (18:00 - 08:00)',
      saturday: '$3.00 for 1st 2 hours, $0.65/next 15 mins',
      sundayPH: '$3.00 for 1st 2 hours, $0.65/next 15 mins',
      gracePeriodMins: 10
    },
    heightLimitM: 2.0,
    hasEVCharging: true,
    evChargerCount: 6,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '2 mins ago'
  },
  {
    id: 'bugis-plus',
    code: 'BP01',
    name: 'Bugis+ Carpark',
    address: '201 Victoria St, Levels 5 & 6',
    area: 'Bugis',
    agency: 'Commercial',
    lat: 1.3005,
    lng: 103.8541,
    totalLots: 320,
    availableLots: 94,
    lotTypes: {
      car: { total: 300, available: 88 },
      motorcycle: { total: 20, available: 6 }
    },
    rates: {
      weekdayDay: '$2.30 for 1st hour, $0.55/next 15 mins',
      weekdayNight: '$3.20 per entry (18:00 - 08:00)',
      saturday: '$2.80 for 1st 2 hours, $0.60/next 15 mins',
      sundayPH: '$2.80 for 1st 2 hours, $0.60/next 15 mins',
      gracePeriodMins: 15
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 4,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  },
  {
    id: 'national-library',
    code: 'NLB01',
    name: 'National Library Building Carpark',
    address: '100 Victoria St, Basement 3',
    area: 'Bugis',
    agency: 'LTA',
    lat: 1.2974,
    lng: 103.8542,
    totalLots: 245,
    availableLots: 132,
    lotTypes: {
      car: { total: 225, available: 122 },
      motorcycle: { total: 20, available: 10 }
    },
    rates: {
      weekdayDay: '$1.40 per 30 mins (07:00 - 19:00)',
      weekdayNight: '$1.40 per 30 mins (cap $6.00)',
      saturday: '$1.40 per 30 mins',
      sundayPH: '$1.40 per 30 mins',
      gracePeriodMins: 15
    },
    heightLimitM: 2.15,
    hasEVCharging: false,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '5 mins ago'
  },

  // Chinatown & CBD
  {
    id: 'chinatown-complex',
    code: 'HDB-CC1',
    name: 'Chinatown Complex HDB Carpark',
    address: 'Block 335 Smith St, Basement',
    area: 'Chinatown',
    agency: 'HDB',
    lat: 1.2823,
    lng: 103.8436,
    totalLots: 460,
    availableLots: 27,
    lotTypes: {
      car: { total: 420, available: 22 },
      motorcycle: { total: 40, available: 5 }
    },
    rates: {
      weekdayDay: '$1.20 per 30 mins (Central Area 07:00 - 17:00)',
      weekdayNight: '$0.60 per 30 mins (capped at $5.00/night)',
      saturday: '$1.20 per 30 mins (07:00 - 17:00)',
      sundayPH: '$0.60 per 30 mins (Free Parking Scheme: 07:00 - 22:30)',
      gracePeriodMins: 15,
      isFreeParking: true,
      freeParkingNote: 'HDB Free Parking on Sundays & Public Holidays 7am-10.30pm'
    },
    heightLimitM: 2.0,
    hasEVCharging: true,
    evChargerCount: 4,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '1 min ago'
  },
  {
    id: 'peoples-park-centre',
    code: 'PPC01',
    name: 'People\'s Park Centre Carpark',
    address: '101 Upper Cross St, Multi-Storey Levels 3-6',
    area: 'Chinatown',
    agency: 'Commercial',
    lat: 1.2855,
    lng: 103.8443,
    totalLots: 380,
    availableLots: 64,
    lotTypes: {
      car: { total: 350, available: 58 },
      motorcycle: { total: 30, available: 6 }
    },
    rates: {
      weekdayDay: '$2.00 per hour (07:00 - 17:00)',
      weekdayNight: '$2.50 per entry (17:00 - 07:00)',
      saturday: '$2.00 per hour (07:00 - 17:00)',
      sundayPH: '$2.50 per entry',
      gracePeriodMins: 10
    },
    heightLimitM: 1.9,
    hasEVCharging: false,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '4 mins ago'
  },
  {
    id: 'one-raffles-quay',
    code: 'ORQ01',
    name: 'One Raffles Quay Carpark',
    address: '1 Raffles Quay, Basement 2',
    area: 'CBD / Downtown',
    agency: 'Commercial',
    lat: 1.2817,
    lng: 103.8524,
    totalLots: 420,
    availableLots: 86,
    lotTypes: {
      car: { total: 400, available: 82 },
      motorcycle: { total: 20, available: 4 }
    },
    rates: {
      weekdayDay: '$3.50 per 30 mins (07:00 - 18:00)',
      weekdayNight: '$3.50 per entry (18:00 - 06:00)',
      saturday: '$3.50 per entry',
      sundayPH: '$3.50 per entry',
      gracePeriodMins: 10
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 6,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '2 mins ago'
  },

  // HarbourFront & Sentosa
  {
    id: 'vivocity-carpark',
    code: 'VC01',
    name: 'VivoCity Multi-Storey & Basement Carpark',
    address: '1 HarbourFront Walk, B1, B2 & Levels 2-7',
    area: 'HarbourFront',
    agency: 'Commercial',
    lat: 1.2642,
    lng: 103.8223,
    totalLots: 2180,
    availableLots: 560,
    lotTypes: {
      car: { total: 2050, available: 530 },
      motorcycle: { total: 130, available: 30 }
    },
    rates: {
      weekdayDay: '$1.60 for 1st hour, $0.50/next 15 mins (07:00 - 18:00)',
      weekdayNight: '$3.20 per entry (18:00 - 04:00)',
      saturday: '$1.80 for 1st hr, $0.60/next 15 mins',
      sundayPH: '$1.80 for 1st hr, $0.60/next 15 mins',
      gracePeriodMins: 15,
      freeParkingNote: 'VivoRewards bonus points rebate for EV charging'
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 20,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '1 min ago'
  },
  {
    id: 'harbourfront-centre',
    code: 'HFC01',
    name: 'HarbourFront Centre Carpark',
    address: '1 Maritime Square, Levels 3-8',
    area: 'HarbourFront',
    agency: 'Commercial',
    lat: 1.2647,
    lng: 103.8198,
    totalLots: 890,
    availableLots: 310,
    lotTypes: {
      car: { total: 840, available: 295 },
      motorcycle: { total: 50, available: 15 }
    },
    rates: {
      weekdayDay: '$1.60 for 1st hour, $0.45/next 15 mins',
      weekdayNight: '$3.00 per entry (18:00 - 06:00)',
      saturday: '$1.60 for 1st hr, $0.50/next 15 mins',
      sundayPH: '$1.60 for 1st hr, $0.50/next 15 mins',
      gracePeriodMins: 15
    },
    heightLimitM: 2.05,
    hasEVCharging: true,
    evChargerCount: 6,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '3 mins ago'
  },

  // Central / Toa Payoh / Bishan
  {
    id: 'toa-payoh-hub',
    code: 'HDB-TPH',
    name: 'HDB Hub Multi-Storey Carpark (Toa Payoh)',
    address: '500 Lorong 6 Toa Payoh, Basement 1-3',
    area: 'Toa Payoh',
    agency: 'HDB',
    lat: 1.3328,
    lng: 103.8475,
    totalLots: 750,
    availableLots: 280,
    lotTypes: {
      car: { total: 700, available: 260 },
      motorcycle: { total: 50, available: 20 }
    },
    rates: {
      weekdayDay: '$0.60 per 30 mins (07:00 - 17:00)',
      weekdayNight: '$0.60 per 30 mins (cap $5.00/night)',
      saturday: '$0.60 per 30 mins',
      sundayPH: 'Free Parking Scheme (07:00 - 22:30)',
      gracePeriodMins: 15,
      isFreeParking: true,
      freeParkingNote: 'HDB Free Parking on Sundays & Public Holidays 7am-10.30pm'
    },
    heightLimitM: 2.15,
    hasEVCharging: true,
    evChargerCount: 10,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  },
  {
    id: 'junction-8',
    code: 'J801',
    name: 'Junction 8 Bishan Carpark',
    address: '9 Bishan Pl, Basement 2 & 3',
    area: 'Bishan',
    agency: 'Commercial',
    lat: 1.3506,
    lng: 103.8488,
    totalLots: 510,
    availableLots: 45,
    lotTypes: {
      car: { total: 470, available: 41 },
      motorcycle: { total: 40, available: 4 }
    },
    rates: {
      weekdayDay: '$1.40 for 1st hour, $0.40/next 15 mins (06:00 - 17:59)',
      weekdayNight: '$2.50 per entry (18:00 - 05:59)',
      saturday: '$1.50 for 1st hour, $0.45/next 15 mins',
      sundayPH: '$1.50 for 1st hour, $0.45/next 15 mins',
      gracePeriodMins: 15
    },
    heightLimitM: 2.0,
    hasEVCharging: true,
    evChargerCount: 6,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '1 min ago'
  },

  // East / Tampines / Changi
  {
    id: 'tampines-mall',
    code: 'TM01',
    name: 'Tampines Mall Carpark',
    address: '4 Tampines Central 5, Basement 2 & 3',
    area: 'Tampines',
    agency: 'Commercial',
    lat: 1.3532,
    lng: 103.9452,
    totalLots: 620,
    availableLots: 78,
    lotTypes: {
      car: { total: 580, available: 72 },
      motorcycle: { total: 40, available: 6 }
    },
    rates: {
      weekdayDay: '$1.50 for 1st hour, $0.40/next 15 mins (06:00 - 17:59)',
      weekdayNight: '$2.60 per entry (18:00 - 05:59)',
      saturday: '$1.60 for 1st hr, $0.45/next 15 mins',
      sundayPH: '$1.60 for 1st hr, $0.45/next 15 mins',
      gracePeriodMins: 15
    },
    heightLimitM: 2.0,
    hasEVCharging: true,
    evChargerCount: 8,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '2 mins ago'
  },
  {
    id: 'our-tampines-hub',
    code: 'OTH01',
    name: 'Our Tampines Hub Carpark',
    address: '1 Tampines Walk, Basement 1 & 2',
    area: 'Tampines',
    agency: 'Commercial',
    lat: 1.3539,
    lng: 103.9405,
    totalLots: 1400,
    availableLots: 612,
    lotTypes: {
      car: { total: 1300, available: 570 },
      motorcycle: { total: 100, available: 42 }
    },
    rates: {
      weekdayDay: '$0.024/min ($1.44/hr) (06:00 - 17:59)',
      weekdayNight: '$2.40 per entry (18:00 - 05:59)',
      saturday: '$0.024/min',
      sundayPH: '$0.024/min',
      gracePeriodMins: 15,
      freeParkingNote: 'Free parking on weekdays 12pm-2pm'
    },
    heightLimitM: 2.15,
    hasEVCharging: true,
    evChargerCount: 14,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  },
  {
    id: 'jewel-changi',
    code: 'JEWEL',
    name: 'Jewel Changi Airport Carpark (B3-B5)',
    address: '78 Airport Blvd., Basement 3 to 5',
    area: 'Changi',
    agency: 'Commercial',
    lat: 1.3602,
    lng: 103.9897,
    totalLots: 2500,
    availableLots: 920,
    lotTypes: {
      car: { total: 2400, available: 885 },
      motorcycle: { total: 100, available: 35 }
    },
    rates: {
      weekdayDay: '$0.04/min for 1st 90 mins, then $5/30 mins thereafter',
      weekdayNight: '$0.04/min ($2.40/hr)',
      saturday: '$0.04/min 1st 90 mins',
      sundayPH: '$0.04/min 1st 90 mins',
      gracePeriodMins: 10,
      freeParkingNote: 'Free parking promotion available with Changi Rewards'
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 24,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  },

  // West / Jurong East
  {
    id: 'westgate-jurong',
    code: 'WG01',
    name: 'Westgate & JEM Linked Carpark',
    address: '3 Gateway Dr, Basement 2',
    area: 'Jurong East',
    agency: 'Commercial',
    lat: 1.3347,
    lng: 103.7431,
    totalLots: 1250,
    availableLots: 310,
    lotTypes: {
      car: { total: 1180, available: 290 },
      motorcycle: { total: 70, available: 20 }
    },
    rates: {
      weekdayDay: '$1.45 for 1st hour, $0.45/next 15 mins (06:00 - 17:59)',
      weekdayNight: '$2.80 per entry (18:00 - 05:59)',
      saturday: '$1.60 for 1st hr, $0.50/next 15 mins',
      sundayPH: '$1.60 for 1st hr, $0.50/next 15 mins',
      gracePeriodMins: 15
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 16,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '1 min ago'
  },
  {
    id: 'jurong-point',
    code: 'JP01',
    name: 'Jurong Point Shopping Centre Carpark',
    address: '1 Jurong West Central 2, Levels 3 & B1',
    area: 'Jurong East',
    agency: 'Commercial',
    lat: 1.3402,
    lng: 103.7061,
    totalLots: 1420,
    availableLots: 420,
    lotTypes: {
      car: { total: 1350, available: 395 },
      motorcycle: { total: 70, available: 25 }
    },
    rates: {
      weekdayDay: '$1.30 for 1st 2 hours, $1.10/next 30 mins (07:00 - 17:00)',
      weekdayNight: '$2.50 per entry (17:00 - 07:00)',
      saturday: '$2.20 for 1st 2 hours, $1.20/next 30 mins',
      sundayPH: '$2.20 for 1st 2 hours, $1.20/next 30 mins',
      gracePeriodMins: 15,
      freeParkingNote: 'Free weekday lunch parking 12:00 - 14:00 (Mon-Fri)'
    },
    heightLimitM: 2.05,
    hasEVCharging: true,
    evChargerCount: 8,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  },
  {
    id: 'imm-building',
    code: 'IMM01',
    name: 'IMM Building Carpark (Outlet Mall)',
    address: '2 Jurong East St 21, Multi-Storey Levels 3-5',
    area: 'Jurong East',
    agency: 'Commercial',
    lat: 1.3352,
    lng: 103.7469,
    totalLots: 1300,
    availableLots: 512,
    lotTypes: {
      car: { total: 1220, available: 480 },
      motorcycle: { total: 80, available: 32 }
    },
    rates: {
      weekdayDay: '1st hour FREE (Mon-Fri excl PH), then $0.40/15 mins',
      weekdayNight: '$2.60 per entry (18:00 - 07:59)',
      saturday: '$1.50 for 1st hour, $0.40/next 15 mins',
      sundayPH: '$1.50 for 1st hour, $0.40/next 15 mins',
      gracePeriodMins: 15,
      isFreeParking: true,
      freeParkingNote: '1st Hour FREE on weekdays for 1st entry per vehicle per day'
    },
    heightLimitM: 2.15,
    hasEVCharging: true,
    evChargerCount: 10,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '3 mins ago'
  },

  // North / Woodlands
  {
    id: 'causeway-point',
    code: 'CWP01',
    name: 'Causeway Point Woodlands Carpark',
    address: '1 Woodlands Square, Basement 1 & 2',
    area: 'Woodlands',
    agency: 'Commercial',
    lat: 1.4361,
    lng: 103.7865,
    totalLots: 820,
    availableLots: 195,
    lotTypes: {
      car: { total: 770, available: 182 },
      motorcycle: { total: 50, available: 13 }
    },
    rates: {
      weekdayDay: '$1.30 for 1st hour, $0.35/next 15 mins (07:00 - 17:00)',
      weekdayNight: '$2.20 per entry (17:00 - 07:00)',
      saturday: '$1.40 for 1st hour, $0.40/next 15 mins',
      sundayPH: '$1.40 for 1st hour, $0.40/next 15 mins',
      gracePeriodMins: 15
    },
    heightLimitM: 2.1,
    hasEVCharging: true,
    evChargerCount: 8,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: '2 mins ago'
  },
  {
    id: 'woodlands-civic-centre',
    code: 'HDB-WCC',
    name: 'Woodlands Civic Centre HDB Carpark',
    address: '900 South Woodlands Dr, Multi-Storey',
    area: 'Woodlands',
    agency: 'HDB',
    lat: 1.4350,
    lng: 103.7876,
    totalLots: 480,
    availableLots: 240,
    lotTypes: {
      car: { total: 440, available: 215 },
      motorcycle: { total: 40, available: 25 }
    },
    rates: {
      weekdayDay: '$0.60 per 30 mins (07:00 - 17:00)',
      weekdayNight: '$0.60 per 30 mins (cap $5.00/night)',
      saturday: '$0.60 per 30 mins',
      sundayPH: 'Free Parking Scheme (07:00 - 22:30)',
      gracePeriodMins: 15,
      isFreeParking: true,
      freeParkingNote: 'HDB Free Parking on Sundays & Public Holidays 7am-10.30pm'
    },
    heightLimitM: 2.15,
    hasEVCharging: true,
    evChargerCount: 4,
    isSheltered: true,
    parkingSystem: 'Electronic Parking System (EPS)',
    lastUpdated: 'Just now'
  }
];
