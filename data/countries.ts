
import { Country } from '../types';

export const countryData: Country[] = [
  // Level 1: Very Common
  { name: 'United States', code: 'us', capital: 'Washington, D.C.', currency: 'United States Dollar', difficulty: 1 },
  { name: 'France', code: 'fr', capital: 'Paris', currency: 'Euro', difficulty: 1 },
  { name: 'United Kingdom', code: 'gb', capital: 'London', currency: 'British Pound', difficulty: 1 },
  { name: 'Japan', code: 'jp', capital: 'Tokyo', currency: 'Japanese Yen', difficulty: 1 },
  { name: 'Germany', code: 'de', capital: 'Berlin', currency: 'Euro', difficulty: 1 },
  { name: 'Italy', code: 'it', capital: 'Rome', currency: 'Euro', difficulty: 1 },
  { name: 'Canada', code: 'ca', capital: 'Ottawa', currency: 'Canadian Dollar', difficulty: 1 },
  { name: 'China', code: 'cn', capital: 'Beijing', currency: 'Renminbi', difficulty: 1 },
  { name: 'Brazil', code: 'br', capital: 'Brasília', currency: 'Brazilian Real', difficulty: 1 },
  { name: 'Australia', code: 'au', capital: 'Canberra', currency: 'Australian Dollar', difficulty: 1 },

  // Level 2: Common
  { name: 'Spain', code: 'es', capital: 'Madrid', currency: 'Euro', difficulty: 2 },
  { name: 'India', code: 'in', capital: 'New Delhi', currency: 'Indian Rupee', difficulty: 2 },
  { name: 'Mexico', code: 'mx', capital: 'Mexico City', currency: 'Mexican Peso', difficulty: 2 },
  { name: 'Russia', code: 'ru', capital: 'Moscow', currency: 'Russian Ruble', difficulty: 2 },
  { name: 'South Korea', code: 'kr', capital: 'Seoul', currency: 'South Korean Won', difficulty: 2 },
  { name: 'Egypt', code: 'eg', capital: 'Cairo', currency: 'Egyptian Pound', difficulty: 2 },
  { name: 'Turkey', code: 'tr', capital: 'Ankara', currency: 'Turkish Lira', difficulty: 2 },
  { name: 'Argentina', code: 'ar', capital: 'Buenos Aires', currency: 'Argentine Peso', difficulty: 2 },
  { name: 'Greece', code: 'gr', capital: 'Athens', currency: 'Euro', difficulty: 2 },
  { name: 'South Africa', code: 'za', capital: 'Pretoria', currency: 'South African Rand', difficulty: 2 },

  // Level 3: Intermediate
  { name: 'Sweden', code: 'se', capital: 'Stockholm', currency: 'Swedish Krona', difficulty: 3 },
  { name: 'Norway', code: 'no', capital: 'Oslo', currency: 'Norwegian Krone', difficulty: 3 },
  { name: 'Poland', code: 'pl', capital: 'Warsaw', currency: 'Polish Złoty', difficulty: 3 },
  { name: 'Vietnam', code: 'vn', capital: 'Hanoi', currency: 'Vietnamese Đồng', difficulty: 3 },
  { name: 'Thailand', code: 'th', capital: 'Bangkok', currency: 'Thai Baht', difficulty: 3 },
  { name: 'Portugal', code: 'pt', capital: 'Lisbon', currency: 'Euro', difficulty: 3 },
  { name: 'Switzerland', code: 'ch', capital: 'Bern', currency: 'Swiss Franc', difficulty: 3 },
  { name: 'Netherlands', code: 'nl', capital: 'Amsterdam', currency: 'Euro', difficulty: 3 },
  { name: 'Ireland', code: 'ie', capital: 'Dublin', currency: 'Euro', difficulty: 3 },
  { name: 'New Zealand', code: 'nz', capital: 'Wellington', currency: 'New Zealand Dollar', difficulty: 3 },

  // Level 4: Recognizable
  { name: 'Chile', code: 'cl', capital: 'Santiago', currency: 'Chilean Peso', difficulty: 4 },
  { name: 'Peru', code: 'pe', capital: 'Lima', currency: 'Sol', difficulty: 4 },
  { name: 'Ukraine', code: 'ua', capital: 'Kyiv', currency: 'Ukrainian Hryvnia', difficulty: 4 },
  { name: 'Morocco', code: 'ma', capital: 'Rabat', currency: 'Moroccan Dirham', difficulty: 4 },
  { name: 'Finland', code: 'fi', capital: 'Helsinki', currency: 'Euro', difficulty: 4 },
  { name: 'Colombia', code: 'co', capital: 'Bogotá', currency: 'Colombian Peso', difficulty: 4 },
  { name: 'Malaysia', code: 'my', capital: 'Kuala Lumpur', currency: 'Malaysian Ringgit', difficulty: 4 },
  { name: 'Philippines', code: 'ph', capital: 'Manila', currency: 'Philippine Peso', difficulty: 4 },
  { name: 'Indonesia', code: 'id', capital: 'Jakarta', currency: 'Indonesian Rupiah', difficulty: 4 },
  { name: 'Israel', code: 'il', capital: 'Jerusalem', currency: 'Israeli New Shekel', difficulty: 4 },

  // Level 5: Moderate
  { name: 'Iceland', code: 'is', capital: 'Reykjavík', currency: 'Icelandic Króna', difficulty: 5 },
  { name: 'Croatia', code: 'hr', capital: 'Zagreb', currency: 'Euro', difficulty: 5 },
  { name: 'Ecuador', code: 'ec', capital: 'Quito', currency: 'United States Dollar', difficulty: 5 },
  { name: 'Uruguay', code: 'uy', capital: 'Montevideo', currency: 'Uruguayan Peso', difficulty: 5 },
  { name: 'Kenya', code: 'ke', capital: 'Nairobi', currency: 'Kenyan Shilling', difficulty: 5 },
  { name: 'Nigeria', code: 'ng', capital: 'Abuja', currency: 'Nigerian Naira', difficulty: 5 },
  { name: 'Pakistan', code: 'pk', capital: 'Islamabad', currency: 'Pakistani Rupee', difficulty: 5 },
  { name: 'Singapore', code: 'sg', capital: 'Singapore', currency: 'Singapore Dollar', difficulty: 5 },
  { name: 'Romania', code: 'ro', capital: 'Bucharest', currency: 'Romanian Leu', difficulty: 5 },
  { name: 'Slovakia', code: 'sk', capital: 'Bratislava', currency: 'Euro', difficulty: 5 },

  // Level 6: Obscureish
  { name: 'Nepal', code: 'np', capital: 'Kathmandu', currency: 'Nepalese Rupee', difficulty: 6 },
  { name: 'Bhutan', code: 'bt', capital: 'Thimphu', currency: 'Bhutanese Ngultrum', difficulty: 6 },
  { name: 'Estonia', code: 'ee', capital: 'Tallinn', currency: 'Euro', difficulty: 6 },
  { name: 'Latvia', code: 'lv', capital: 'Riga', currency: 'Euro', difficulty: 6 },
  { name: 'Lithuania', code: 'lt', capital: 'Vilnius', currency: 'Euro', difficulty: 6 },
  { name: 'Georgia', code: 'ge', capital: 'Tbilisi', currency: 'Georgian Lari', difficulty: 6 },
  { name: 'Armenia', code: 'am', capital: 'Yerevan', currency: 'Armenian Dram', difficulty: 6 },
  { name: 'Azerbaijan', code: 'az', capital: 'Baku', currency: 'Azerbaijani Manat', difficulty: 6 },
  { name: 'Jordan', code: 'jo', capital: 'Amman', currency: 'Jordanian Dinar', difficulty: 6 },
  { name: 'Oman', code: 'om', capital: 'Muscat', currency: 'Omani Rial', difficulty: 6 },

  // Level 7: Challenging
  { name: 'Mongolia', code: 'mn', capital: 'Ulaanbaatar', currency: 'Mongolian Tögrög', difficulty: 7 },
  { name: 'Uzbekistan', code: 'uz', capital: 'Tashkent', currency: 'Uzbekistani Soʻm', difficulty: 7 },
  { name: 'Kazakhstan', code: 'kz', capital: 'Astana', currency: 'Kazakhstani Tenge', difficulty: 7 },
  { name: 'Senegal', code: 'sn', capital: 'Dakar', currency: 'West African CFA Franc', difficulty: 7 },
  { name: 'Botswana', code: 'bw', capital: 'Gaborone', currency: 'Botswana Pula', difficulty: 7 },
  { name: 'Namibia', code: 'na', capital: 'Windhoek', currency: 'Namibian Dollar', difficulty: 7 },
  { name: 'Suriname', code: 'sr', capital: 'Paramaribo', currency: 'Surinamese Dollar', difficulty: 7 },
  { name: 'Paraguay', code: 'py', capital: 'Asunción', currency: 'Paraguayan Guaraní', difficulty: 7 },
  { name: 'Malta', code: 'mt', capital: 'Valletta', currency: 'Euro', difficulty: 7 },
  { name: 'Luxembourg', code: 'lu', capital: 'Luxembourg City', currency: 'Euro', difficulty: 7 },

  // Level 8: Hard
  { name: 'Mauritius', code: 'mu', capital: 'Port Louis', currency: 'Mauritian Rupee', difficulty: 8 },
  { name: 'Seychelles', code: 'sc', capital: 'Victoria', currency: 'Seychellois Rupee', difficulty: 8 },
  { name: 'Cape Verde', code: 'cv', capital: 'Praia', currency: 'Cape Verdean Escudo', difficulty: 8 },
  { name: 'Togo', code: 'tg', capital: 'Lomé', currency: 'West African CFA Franc', difficulty: 8 },
  { name: 'Benin', code: 'bj', capital: 'Porto-Novo', currency: 'West African CFA Franc', difficulty: 8 },
  { name: 'Kyrgyzstan', code: 'kg', capital: 'Bishkek', currency: 'Kyrgyzstani Som', difficulty: 8 },
  { name: 'Tajikistan', code: 'tj', capital: 'Dushanbe', currency: 'Tajikistani Somoni', difficulty: 8 },
  { name: 'Laos', code: 'la', capital: 'Vientiane', currency: 'Lao Kip', difficulty: 8 },
  { name: 'Brunei', code: 'bn', capital: 'Bandar Seri Begawan', currency: 'Brunei Dollar', difficulty: 8 },
  { name: 'Montenegro', code: 'me', capital: 'Podgorica', currency: 'Euro', difficulty: 8 },

  // Level 9: Obscure
  { name: 'Kiribati', code: 'ki', capital: 'South Tarawa', currency: 'Australian Dollar', difficulty: 9 },
  { name: 'Vanuatu', code: 'vu', capital: 'Port Vila', currency: 'Vanuatu Vatu', difficulty: 9 },
  { name: 'Palau', code: 'pw', capital: 'Ngerulmud', currency: 'United States Dollar', difficulty: 9 },
  { name: 'Djibouti', code: 'dj', capital: 'Djibouti City', currency: 'Djiboutian Franc', difficulty: 9 },
  { name: 'Comoros', code: 'km', capital: 'Moroni', currency: 'Comorian Franc', difficulty: 9 },
  { name: 'Gambia', code: 'gm', capital: 'Banjul', currency: 'Gambian Dalasi', difficulty: 9 },
  { name: 'Burundi', code: 'bi', capital: 'Gitega', currency: 'Burundian Franc', difficulty: 9 },
  { name: 'Lesotho', code: 'ls', capital: 'Maseru', currency: 'Lesotho Loti', difficulty: 9 },
  { name: 'Gabon', code: 'ga', capital: 'Libreville', currency: 'Central African CFA Franc', difficulty: 9 },
  { name: 'Malawi', code: 'mw', capital: 'Lilongwe', currency: 'Malawian Kwacha', difficulty: 9 },

  // Level 10: Master
  { name: 'Nauru', code: 'nr', capital: 'Yaren', currency: 'Australian Dollar', difficulty: 10 },
  { name: 'Tuvalu', code: 'tv', capital: 'Funafuti', currency: 'Australian Dollar', difficulty: 10 },
  { name: 'San Marino', code: 'sm', capital: 'San Marino', currency: 'Euro', difficulty: 10 },
  { name: 'Liechtenstein', code: 'li', capital: 'Vaduz', currency: 'Swiss Franc', difficulty: 10 },
  { name: 'Andorra', code: 'ad', capital: 'Andorra la Vella', currency: 'Euro', difficulty: 10 },
  { name: 'Sao Tome and Principe', code: 'st', capital: 'São Tomé', currency: 'São Tomé and Príncipe Dobra', difficulty: 10 },
  { name: 'Equatorial Guinea', code: 'gq', capital: 'Malabo', currency: 'Central African CFA Franc', difficulty: 10 },
  { name: 'Marshall Islands', code: 'mh', capital: 'Majuro', currency: 'United States Dollar', difficulty: 10 },
  { name: 'Saint Vincent and the Grenadines', code: 'vc', capital: 'Kingstown', currency: 'East Caribbean Dollar', difficulty: 10 },
  { name: 'Federated States of Micronesia', code: 'fm', capital: 'Palikir', currency: 'United States Dollar', difficulty: 10 },
];
