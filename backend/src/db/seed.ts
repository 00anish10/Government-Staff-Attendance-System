import { query } from '../config/database';

const seed = async () => {
  console.log('Seeding database...');

  await query(`TRUNCATE TABLE leave_requests, attendance, users, staff, designations, departments RESTART IDENTITY CASCADE`);

  await query(`
    INSERT INTO departments (name, name_np, code, description) VALUES
    ('Ministry of Home Affairs', 'गृह मन्त्रालय', 'MHA', 'Responsible for internal affairs'),
    ('Ministry of Finance', 'अर्थ मन्त्रालय', 'MOF', 'Responsible for financial management'),
    ('Ministry of Education', 'शिक्षा मन्त्रालय', 'MOE', 'Responsible for education policy'),
    ('Ministry of Health', 'स्वास्थ्य मन्त्रालय', 'MOH', 'Responsible for healthcare services'),
    ('Ministry of Agriculture', 'कृषि मन्त्रालय', 'MOA', 'Responsible for agricultural development'),
    ('Office of Prime Minister', 'प्रधानमन्त्री कार्यालय', 'OPM', 'Prime Minister''s Office');
  `);

  await query(`
    INSERT INTO designations (title, title_np, grade, pay_scale, department_id) VALUES
    ('Secretary', 'सचिव', 'Grade I', 80000, 1),
    ('Joint Secretary', 'सहसचिव', 'Grade II', 65000, 1),
    ('Under Secretary', 'उपसचिव', 'Grade III', 50000, 1),
    ('Section Officer', 'शाखा अधिकृत', 'Grade IV', 40000, 1),
    ('Assistant Level Officer', 'सहायक स्तरको अधिकृत', 'Grade V', 30000, 2),
    ('Accountant', 'लेखापाल', 'Grade IV', 35000, 2),
    ('Teacher', 'शिक्षक', 'Grade IV', 35000, 3),
    ('Professor', 'प्राध्यापक', 'Grade II', 60000, 3),
    ('Doctor', 'डाक्टर', 'Grade II', 70000, 4),
    ('Nurse', 'नर्स', 'Grade IV', 35000, 4),
    ('Agriculture Officer', 'कृषि अधिकृत', 'Grade IV', 40000, 5),
    ('IT Officer', 'सूचना प्रविधि अधिकृत', 'Grade III', 45000, 6),
    ('Administrative Officer', 'प्रशासन अधिकृत', 'Grade IV', 35000, 1);
  `);

  await query(`
    INSERT INTO staff (employee_id, full_name, full_name_np, email, phone, address, date_of_birth, date_of_joining, age, is_minor, gender, designation_id, department_id) VALUES
    ('HAJ001', 'Ram Prasad Sharma', 'राम प्रसाद शर्मा', 'ram.sharma@gov.np', '9841000001', 'Kathmandu', '1975-03-15', '2000-06-01', 25, false, 'male', 1, 1),
    ('HAJ002', 'Sita Devi Adhikari', 'सीता देवी अधिकारी', 'sita.adhikari@gov.np', '9841000002', 'Lalitpur', '1980-07-22', '2005-09-15', 25, false, 'female', 2, 1),
    ('HAJ003', 'Hari Bahadur Thapa', 'हरि बहादुर थापा', 'hari.thapa@gov.np', '9841000003', 'Pokhara', '1985-11-10', '2008-03-20', 22, false, 'male', 3, 2),
    ('HAJ004', 'Gita Kumari Poudel', 'गीता कुमारी पौडेल', 'gita.poudel@gov.np', '9841000004', 'Biratnagar', '1990-01-05', '2012-07-10', 22, false, 'female', 4, 2),
    ('HAJ005', 'Krishna Prasad Ghimire', 'कृष्ण प्रसाद घिमिरे', 'krishna.ghimire@gov.np', '9841000005', 'Chitwan', '1982-09-18', '2006-11-25', 24, false, 'male', 5, 3),
    ('HAJ006', 'Maya Devi Sharma', 'माया देवी शर्मा', 'maya.sharma@gov.np', '9841000006', 'Kathmandu', '1988-04-12', '2010-02-01', 21, false, 'female', 6, 3),
    ('HAJ007', 'Rajendra Kumar Singh', 'राजेन्द्र कुमार सिंह', 'rajendra.singh@gov.np', '9841000007', 'Janakpur', '1978-08-30', '2001-05-15', 22, false, 'male', 7, 4),
    ('HAJ008', 'Sunita Rai', 'सुनिता राई', 'sunita.rai@gov.np', '9841000008', 'Dharan', '1992-12-25', '2015-09-01', 22, false, 'female', 8, 4),
    ('HAJ009', 'Prakash Neupane', 'प्रकाश न्यौपाने', 'prakash.neupane@gov.np', '9841000009', 'Butwal', '1986-06-14', '2009-04-10', 22, false, 'male', 9, 5),
    ('HAJ010', 'Anita Gurung', 'अनिता गुरुङ', 'anita.gurung@gov.np', '9841000010', 'Pokhara', '1995-02-28', '2018-08-15', 23, false, 'female', 10, 5),
    ('HAJ011', 'Bishnu Prasad Pokharel', 'विष्णु प्रसाद पोखरेल', 'bishnu.pokharel@gov.np', '9841000011', 'Nepalgunj', '1983-10-05', '2007-01-20', 23, false, 'male', 11, 6),
    ('HAJ012', 'Deepak Bhandari', 'दीपक भण्डारी', 'deepak.bhandari@gov.np', '9841000012', 'Kathmandu', '1991-05-20', '2014-06-01', 23, false, 'male', 12, 6),
    ('HAJ013', 'Rekha Thapa', 'रेखा थापा', 'rekha.thapa@gov.np', '9841000013', 'Lalitpur', '1987-03-08', '2011-10-15', 24, false, 'female', 13, 1),
    ('HAJ014', 'Mohan Khadka', 'मोहन खड्का', 'mohan.khadka@gov.np', '9841000014', 'Dhangadhi', '1993-07-17', '2016-03-01', 22, false, 'male', 4, 2),
    ('HAJ015', 'Sarita Tamang', 'सरिता तामाङ', 'sarita.tamang@gov.np', '9841000015', 'Hetauda', '1996-09-22', '2019-05-10', 22, false, 'female', 10, 4);
  `);

  await query(`INSERT INTO users (username, password_hash, role, staff_id) VALUES ('admin', 'admin123', 'admin', 1)`);

  const today = new Date().toISOString().split('T')[0];
  const staffResult = await query(`SELECT id FROM staff`);
  const staffIds = staffResult.rows.map(r => r.id);

  for (const id of staffIds) {
    const isPresent = Math.random() > 0.2;
    const isLate = isPresent && Math.random() > 0.8;
    const checkInHour = isLate ? 10 : Math.floor(Math.random() * 2) + 8;
    const checkInMin = Math.floor(Math.random() * 60);
    const checkOutHour = 17;
    const checkOutMin = Math.floor(Math.random() * 30);

    const status = isPresent ? (isLate ? 'late' : 'present') : 'absent';
    const checkIn = isPresent ? `${today} ${String(checkInHour).padStart(2,'0')}:${String(checkInMin).padStart(2,'0')}:00` : null;
    const checkOut = isPresent ? `${today} ${String(checkOutHour).padStart(2,'0')}:${String(checkOutMin).padStart(2,'0')}:00` : null;

    await query(
      `INSERT INTO attendance (staff_id, date, check_in, check_out, status) VALUES ($1, $2, $3, $4, $5)`,
      [id, today, checkIn, checkOut, status]
    );
  }

  await query(`
    INSERT INTO leave_requests (staff_id, leave_type, start_date, end_date, reason, status) VALUES
    (3, 'annual', '2025-12-25', '2025-12-28', 'Going to hometown for festival', 'approved'),
    (5, 'sick', '2025-12-20', '2025-12-22', 'Medical treatment', 'approved'),
    (7, 'personal', '2026-01-10', '2026-01-10', 'Family event', 'pending'),
    (9, 'annual', '2026-02-01', '2026-02-05', 'Vacation with family', 'pending'),
    (11, 'sick', '2026-01-15', '2026-01-16', 'Health checkup', 'approved'),
    (13, 'personal', '2026-03-01', '2026-03-01', 'Personal work', 'pending');
  `);

  console.log('Seeding completed successfully!');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
