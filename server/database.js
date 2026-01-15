import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const Inscription = sequelize.define('Inscription', {
  nom: { type: DataTypes.STRING, allowNull: false },
  prenom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  telephone: { type: DataTypes.STRING, allowNull: false },
  region: { type: DataTypes.STRING },
  organisation: { type: DataTypes.STRING },
  fonction: { type: DataTypes.STRING },
  besoins: { type: DataTypes.TEXT },
  profile: { type: DataTypes.STRING }, // "agriculteur", "startup", etc.
  badgeId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  status: { type: DataTypes.STRING, defaultValue: 'PENDING' }, // PENDING, APPROVED, REJECTED
  specificData: { type: DataTypes.TEXT }, // JSON string for detailed profile data
});

const Contact = sequelize.define('Contact', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  sujet: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT, allowNull: false },
});

const initDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true }); // Updates tables if they exist
        console.log('Database synced.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export { sequelize, Inscription, Contact, initDb };
