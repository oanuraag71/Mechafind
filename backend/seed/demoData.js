const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Mechanic = require('../models/Mechanic');

const demoPassword = 'DemoPass!2026';
const exportPath = path.join(__dirname, '..', 'demo-accounts.txt');

const userFirstNames = [
  'Aarav', 'Vihaan', 'Ishaan', 'Reyansh', 'Arjun', 'Aditya', 'Kabir', 'Rohan', 'Kian', 'Neel',
  'Aanya', 'Diya', 'Myra', 'Sara', 'Anaya', 'Ira', 'Kiara', 'Naina', 'Riya', 'Tara',
  'Dev', 'Rudra', 'Yash', 'Om', 'Manav', 'Zayan', 'Pranav', 'Atharv', 'Krish', 'Vivaan',
  'Siya', 'Avni', 'Meera', 'Navya', 'Pari', 'Mira', 'Saanvi', 'Aditi', 'Anika', 'Ishita',
  'Aria', 'Tanvi', 'Veda', 'Lavanya', 'Pihu', 'Mahika', 'Niharika', 'Ritika', 'Suhani', 'Trisha',
];

const lastNames = [
  'Sharma', 'Mehta', 'Reddy', 'Kapoor', 'Verma', 'Nair', 'Patel', 'Rao', 'Iyer', 'Malhotra',
];

const mechanicFirstNames = [
  'Marcus', 'Adrian', 'Noah', 'Daniel', 'Luca', 'Sofia', 'Nina', 'Clara', 'Ethan', 'Mason',
  'Aiden', 'Logan', 'Miles', 'Leo', 'Owen', 'Hudson', 'Ezra', 'Theo', 'Julian', 'Caleb',
  'Ava', 'Maya', 'Lena', 'Ruby', 'Ella', 'Jade', 'Zoe', 'Mila', 'Layla', 'Skye',
  'Cole', 'Brooks', 'Hayes', 'Parker', 'Roman', 'Finn', 'Axel', 'Dylan', 'Grant', 'Nolan',
  'Tessa', 'Elise', 'Hazel', 'Cora', 'Ivy', 'Sage', 'Ariel', 'Nova', 'Quinn', 'Rhea',
];

const cities = [
  { city: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { city: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { city: 'Pune', lat: 18.5204, lng: 73.8567 },
  { city: 'Delhi', lat: 28.6139, lng: 77.209 },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { city: 'Kochi', lat: 9.9312, lng: 76.2673 },
];

const specializations = [
  'Engine Diagnostics',
  'Electrical Systems',
  'Transmission Repair',
  'Performance Tuning',
  'Brake and Suspension',
  'AC and Climate Control',
  'Luxury Vehicle Service',
  'Roadside Rescue',
  'Hybrid Systems',
  'General Auto Repair',
];

function buildUsers() {
  return userFirstNames.map((firstName, index) => {
    const lastName = lastNames[index % lastNames.length];
    const username = `${firstName} ${lastName}`;
    const slug = `${firstName}.${lastName}`.toLowerCase();
    return {
      username,
      email: `demo.user.${String(index + 1).padStart(2, '0')}@mechafind.dev`,
      password: demoPassword,
      phone: `900000${String(index + 1).padStart(4, '0')}`,
      role: 'user',
      slug,
    };
  });
}

function buildMechanics() {
  return mechanicFirstNames.map((firstName, index) => {
    const lastName = lastNames[(index + 3) % lastNames.length];
    const username = `${firstName} ${lastName}`;
    const city = cities[index % cities.length];
    return {
      username,
      email: `demo.mechanic.${String(index + 1).padStart(2, '0')}@mechafind.dev`,
      password: demoPassword,
      phone: `955500${String(index + 1).padStart(4, '0')}`,
      role: 'mechanic',
      specialization: specializations[index % specializations.length],
      location: city.city,
      coordinates: {
        lat: Number((city.lat + ((index % 5) - 2) * 0.012).toFixed(4)),
        lng: Number((city.lng + ((index % 4) - 1.5) * 0.015).toFixed(4)),
      },
      isAvailable: index % 6 !== 0,
      rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    };
  });
}

function renderDemoAccountsText() {
  const users = buildUsers();
  const mechanics = buildMechanics();

  const lines = [
    'MechaFind Demo Accounts',
    '======================',
    '',
    `Shared password for every demo account: ${demoPassword}`,
    '',
    'Demo Users (50)',
    '--------------',
    ...users.map((user, index) =>
      `${String(index + 1).padStart(2, '0')}. ${user.username} | ${user.email} | ${user.phone} | role=user`
    ),
    '',
    'Demo Mechanics (50)',
    '-------------------',
    ...mechanics.map((mechanic, index) =>
      `${String(index + 1).padStart(2, '0')}. ${mechanic.username} | ${mechanic.email} | ${mechanic.phone} | ${mechanic.specialization} | ${mechanic.location} | role=mechanic`
    ),
    '',
  ];

  return lines.join('\n');
}

function writeDemoAccountsFile() {
  fs.writeFileSync(exportPath, renderDemoAccountsText(), 'utf8');
  return exportPath;
}

async function seedDemoData() {
  const existingUsers = await User.countDocuments();
  const existingMechanics = await Mechanic.countDocuments();

  writeDemoAccountsFile();

  if (existingUsers > 0 || existingMechanics > 0) {
    return { seeded: false, exportPath };
  }

  const users = buildUsers();
  const mechanics = buildMechanics();

  await User.create(users.map(({ slug, ...user }) => user));
  const mechanicUsers = await User.create(mechanics.map(({ specialization, location, coordinates, isAvailable, rating, ...user }) => user));

  await Mechanic.create(
    mechanics.map((mechanic, index) => ({
      userId: mechanicUsers[index]._id,
      name: mechanic.username,
      specialization: mechanic.specialization,
      phone: mechanic.phone,
      location: mechanic.location,
      coordinates: mechanic.coordinates,
      isAvailable: mechanic.isAvailable,
      rating: mechanic.rating,
    }))
  );

  return { seeded: true, exportPath };
}

if (require.main === module) {
  const saved = writeDemoAccountsFile();
  console.log(`Demo account list written to ${saved}`);
}

module.exports = {
  demoPassword,
  seedDemoData,
  writeDemoAccountsFile,
  renderDemoAccountsText,
};
