import { query } from '../config/database';

const createTables = async () => {
  console.log('Running database migrations...');

  await query(`
    CREATE TABLE IF NOT EXISTS departments (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      name_np VARCHAR(255) NOT NULL,
      code VARCHAR(50) UNIQUE NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS designations (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      title_np VARCHAR(255) NOT NULL,
      grade VARCHAR(50) NOT NULL,
      pay_scale NUMERIC(10,2) NOT NULL,
      department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS staff (
      id SERIAL PRIMARY KEY,
      employee_id VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      full_name_np VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address TEXT,
      date_of_birth DATE NOT NULL,
      date_of_joining DATE NOT NULL,
      gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
      designation_id INTEGER REFERENCES designations(id) ON DELETE SET NULL,
      department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
      profile_image TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
      date DATE NOT NULL DEFAULT CURRENT_DATE,
      check_in TIMESTAMP,
      check_out TIMESTAMP,
      status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'half-day', 'holiday', 'leave')) NOT NULL DEFAULT 'absent',
      remarks TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(staff_id, date)
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS leave_requests (
      id SERIAL PRIMARY KEY,
      staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
      leave_type VARCHAR(20) CHECK (leave_type IN ('annual', 'sick', 'personal', 'maternity', 'paternity', 'other')) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      reason TEXT NOT NULL,
      status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL DEFAULT 'pending',
      approved_by INTEGER REFERENCES staff(id) ON DELETE SET NULL,
      remarks TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) CHECK (role IN ('admin', 'hr', 'supervisor', 'staff')) NOT NULL DEFAULT 'staff',
      staff_id INTEGER REFERENCES staff(id) ON DELETE SET NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_attendance_staff_date ON attendance(staff_id, date);
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_leave_staff ON leave_requests(staff_id);
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_leave_status ON leave_requests(status);
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department_id);
  `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_staff_designation ON staff(designation_id);
  `);

  console.log('Migrations completed successfully!');
  process.exit(0);
};

createTables().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
