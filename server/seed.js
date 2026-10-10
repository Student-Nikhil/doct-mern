import Doctor from './models/Doctor.js';
import Service from './models/Service.js';

const img = (n, bg) => `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&size=256&background=${bg}&color=fff&bold=true`;
const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const doctors = [
  ['Dr. Aarav Mehta', 'Cardiologist', ['Chest pain', 'High blood pressure', 'Palpitations'], 14, 900, 4.9, '0F766E'],
  ['Dr. Isha Kulkarni', 'Cardiologist', ['Heart check-up', 'Cholesterol'], 9, 750, 4.7, '115E59'],
  ['Dr. Rohan Deshmukh', 'Neurologist', ['Migraine', 'Epilepsy', 'Numbness'], 12, 1000, 4.8, '7C3AED'],
  ['Dr. Sneha Patil', 'Dermatologist', ['Acne', 'Skin allergy', 'Hair fall'], 8, 600, 4.8, 'DB2777'],
  ['Dr. Imran Shaikh', 'Orthopedic', ['Back pain', 'Joint pain', 'Fracture'], 16, 850, 4.9, 'EA580C'],
  ['Dr. Pooja Joshi', 'Pediatrician', ['Child fever', 'Vaccination', 'Growth check'], 10, 500, 4.9, '0891B2'],
  ['Dr. Vikram Nair', 'General Physician', ['Fever', 'Cold & cough', 'Diabetes', 'Fatigue'], 11, 400, 4.6, '16A34A'],
  ['Dr. Ananya Rao', 'Dentist', ['Toothache', 'Cavity', 'Braces'], 7, 450, 4.7, '2563EB'],
  ['Dr. Farhan Ali', 'Eye Specialist', ['Blurred vision', 'Eye infection', 'Cataract'], 13, 700, 4.8, '9333EA'],
  ['Dr. Meera Chavan', 'Pulmonologist', ['Asthma', 'Breathing trouble', 'Chronic cough'], 10, 800, 4.7, 'DC2626']
];

const services = [
  ['Heart care', 'ECG, blood pressure management and cardiac consultations.', 'heart', 'Cardiologist'],
  ['Brain & nerves', 'Diagnosis and treatment for migraine, seizures and nerve pain.', 'brain', 'Neurologist'],
  ['Bone & joint', 'Fracture care, joint pain and physiotherapy guidance.', 'bone', 'Orthopedic'],
  ['Child health', 'Vaccinations, growth checks and common childhood illness.', 'baby', 'Pediatrician'],
  ['Dental care', 'Check-ups, fillings, braces and painless root canals.', 'tooth', 'Dentist'],
  ['Eye care', 'Vision tests, infection treatment and cataract consultations.', 'eye', 'Eye Specialist'],
  ['Skin & hair', 'Acne, allergies, hair fall and skin infections.', 'skin', 'Dermatologist'],
  ['Lung care', 'Asthma, breathing trouble and long-lasting cough.', 'lungs', 'Pulmonologist'],
  ['General check-up', 'Fever, diabetes, fatigue and routine health screening.', 'stethoscope', 'General Physician']
];

export default async function seed() {
  if (!(await Doctor.countDocuments())) {
    await Doctor.insertMany(doctors.map(([name, specialty, treats, experience, fee, rating, bg]) => ({
      name, specialty, treats, experience, fee, rating, slots,
      image: img(name.replace('Dr. ', ''), bg),
      about: `${name} has ${experience} years of experience in ${specialty.toLowerCase()} care.`
    })));
    console.log('Seeded doctors');
  }
  if (!(await Service.countDocuments())) {
    await Service.insertMany(services.map(([title, description, icon, specialty]) => ({ title, description, icon, specialty })));
    console.log('Seeded services');
  }
}
