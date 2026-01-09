import express from "express";
import cors from "cors";
import { createClient } from "redis";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
 
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true ,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

}));
              // parser JSON
app.use(express.urlencoded({ extended: true })); // parser form data
 
 

 

const env = process.env.NODE_ENV || "development";
const isProd = env === "production";

// Choix de la base selon l'environnement
const DB_USER = isProd ? process.env.PROD_DB_USER : process.env.DEV_DB_USER;
const DB_PASS = isProd ? process.env.PROD_DB_PASS : process.env.DEV_DB_PASS;
const DB_HOST = isProd ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST;
const DB_NAME = isProd ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME;
const DB_PORT = isProd ? process.env.PROD_DB_PORT : process.env.DEV_DB_PORT || 5432;

console.log("Connexion à la DB :", DB_NAME, "host:", DB_HOST, "user:", DB_USER);


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT || 5432,
  dialect: "postgres",
  logging: !isProd,
  dialectOptions: isProd
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // important pour Render
        },
      }
    : {},
})
 

 
const JWT_SECRET = process.env.JWT_SECRET


// ========== MODÈLES ==========

// Modèle Utilisateur
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
});

// Modèle Forage
const Forage = sequelize.define('Forage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  forageId: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  depth: DataTypes.FLOAT,
  serviceDate: DataTypes.DATE,
  owner: DataTypes.STRING,
  status: { type: DataTypes.ENUM('active', 'inactive'), defaultValue: 'active' }
}, { timestamps: true });

// Modèle Analyse
const Analysis = sequelize.define('Analysis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  turbidity: DataTypes.FLOAT,
  color: DataTypes.STRING,
  odor: DataTypes.STRING,
  temperature: DataTypes.FLOAT,
  flowRate: DataTypes.FLOAT,
  pH: DataTypes.FLOAT,
  salinity: DataTypes.FLOAT,
  conductivity: DataTypes.FLOAT,
  nitrates: DataTypes.FLOAT,
  nitrites: DataTypes.FLOAT,
  iron: DataTypes.FLOAT,
  manganese: DataTypes.FLOAT,
  heavyMetals: DataTypes.JSON,
  pesticides: DataTypes.JSON,
  eColi: { type: DataTypes.BOOLEAN, defaultValue: false },
  fecalColiformes: { type: DataTypes.BOOLEAN, defaultValue: false },
  enterocoque: { type: DataTypes.BOOLEAN, defaultValue: false },
  parasites: { type: DataTypes.BOOLEAN, defaultValue: false },
  chloreDose: DataTypes.FLOAT,
  chloreType: DataTypes.STRING,
  volumeTraite: DataTypes.FLOAT,
  contactTime: DataTypes.FLOAT,
  chloreResiduel: DataTypes.FLOAT,
  turbidityAfter: DataTypes.FLOAT,
  pHAfter: DataTypes.FLOAT,
  eColiAfter: { type: DataTypes.BOOLEAN, defaultValue: false },
  potable: DataTypes.BOOLEAN,
  reasons: DataTypes.JSON,
  analysisDate: DataTypes.DATE
}, { timestamps: true });

// Relations
User.hasMany(Forage);
Forage.belongsTo(User);
Forage.hasMany(Analysis);
Analysis.belongsTo(Forage);
User.hasMany(Analysis);
Analysis.belongsTo(User);

// ========== MIDDLEWARE D'AUTHENTIFICATION ==========

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
    req.user = user;
    next();
  });
};

// ========== FONCTION D'ÉVALUATION DE POTABILITÉ ==========

const evaluateWaterQuality = (data) => {
  const reasons = [];
  const limits = {
    pH_min: 6.5,
    pH_max: 8.5,
    turbidity_max: 5,
    salinity_max: 1,
    nitrates_max: 50,
    nitrites_max: 0.1,
    iron_max: 0.3,
    manganese_max: 0.4,
    chlore_residuel_min: 0.2
  };

  if (data.pH < limits.pH_min || data.pH > limits.pH_max) {
    reasons.push(`pH ${data.pH} hors limites [${limits.pH_min}-${limits.pH_max}]`);
  }
  if (data.turbidity > limits.turbidity_max) {
    reasons.push(`Turbidité ${data.turbidity} NTU > ${limits.turbidity_max} NTU`);
  }
  if (data.salinity > limits.salinity_max) {
    reasons.push(`Salinité ${data.salinity} g/L > ${limits.salinity_max} g/L`);
  }
  if (data.nitrates > limits.nitrates_max) {
    reasons.push(`Nitrates ${data.nitrates} mg/L > ${limits.nitrates_max} mg/L`);
  }
  if (data.nitrites > limits.nitrites_max) {
    reasons.push(`Nitrites ${data.nitrites} mg/L > ${limits.nitrites_max} mg/L`);
  }
  if (data.iron > limits.iron_max) {
    reasons.push(`Fer ${data.iron} mg/L > ${limits.iron_max} mg/L`);
  }
  if (data.manganese > limits.manganese_max) {
    reasons.push(`Manganèse ${data.manganese} mg/L > ${limits.manganese_max} mg/L`);
  }
  if (data.eColi) reasons.push('Présence d\'E. coli détectée');
  if (data.fecalColiformes) reasons.push('Présence de coliformes fécaux');
  if (data.enterocoque) reasons.push('Présence d\'entérocoques');
  if (data.parasites) reasons.push('Présence de parasites');
  if (data.eColiAfter) reasons.push('E. coli détecté après traitement');
  if (data.chloreResiduel < limits.chlore_residuel_min) {
    reasons.push(`Chlore résiduel ${data.chloreResiduel} mg/L < ${limits.chlore_residuel_min} mg/L`);
  }

  return {
    potable: reasons.length === 0,
    reasons,
    timestamp: new Date()
  };
};

// ========== ROUTES AUTHENTIFICATION ==========

// Inscription
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Les mots de passe ne correspondent pas' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Vérifier le token
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  });
});

// ========== ROUTES FORAGES (PROTÉGÉES) ==========

app.post('/api/forages', authenticateToken, async (req, res) => {
  try {
    const { forageId, name, location, depth, serviceDate, owner, status } = req.body;
     const dbUser = await User.findByPk(req.user.id);

    if (!dbUser) {
      return res.status(401).json({ error: "Utilisateur invalide" });
    }


    const forage = await Forage.create({
      forageId,
      name,
      location,
      depth,
      serviceDate,
      owner,
      status,
      UserId: req.user.id
    });
    
    res.json(forage);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/forages', authenticateToken, async (req, res) => {
  try {      
    const forages = await Forage.findAll({
  include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Analysis
        }
      ]
});
    res.json(forages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/forages/:id', authenticateToken, async (req, res) => {
  try {
    const forage = await Forage.findByPk(req.params.id, {
      include: Analysis
    });
    
    if (!forage || forage.UserId !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    res.json(forage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/forages/:id', authenticateToken, async (req, res) => {
  try {
    const forage = await Forage.findByPk(req.params.id);
    
    if (!forage || forage.UserId !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    await forage.destroy();
    res.json({ message: 'Forage supprimé' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ========== ROUTES ANALYSES (PROTÉGÉES) ==========

app.post('/api/analyses', authenticateToken, async (req, res) => {
  try {
    const { forageId, ...analysisData } = req.body;
    
    // Vérifier que l'utilisateur possède ce forage
    const forage = await Forage.findByPk(forageId);
    if (!forage || forage.UserId !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const evaluation = evaluateWaterQuality(analysisData);
    
    const analysis = await Analysis.create({
      ...analysisData,
      ...evaluation,
      analysisDate: new Date(),
      ForageId: forageId,
      UserId: req.user.id
    });
    
    res.json(analysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/analyses/:forageId', authenticateToken, async (req, res) => {
  try {
    // Vérifier que l'utilisateur possède ce forage
    const forage = await Forage.findByPk(req.params.forageId);
    if (!forage || forage.UserId !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const analyses = await Analysis.findAll({
      where: { ForageId: req.params.forageId },
      order: [['analysisDate', 'DESC']]
    });
    
    res.json(analyses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/analyses/:id', authenticateToken, async (req, res) => {
  try {
    const analysis = await Analysis.findByPk(req.params.id);
    
    if (!analysis || analysis.UserId !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    
    await analysis.destroy();
    res.json({ message: 'Analyse supprimée' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/debug/db', async (req, res) => {
  const forages = await Forage.findAll();
  res.json({
    count: forages.length,
    data: forages
  });
});


// ========== ROUTE STATISTIQUES (PROTÉGÉE) ==========

app.get('/api/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const forages = await Forage.findAll();
    const forageIds = forages.map(f => f.id);
    
    const analyses = await Analysis.findAll({
      include: [
        { model: Forage },
        { model: User, attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['analysisDate', 'DESC']]
    })
    const potable = analyses.filter(a => a.potable).length;
    const nonPotable = analyses.filter(a => !a.potable).length;
    
    res.json({
      totalForages: forages.length,
      totalAnalyses: analyses.length,
      potable,
      nonPotable
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


 
// // OPTIONS pour toutes les routes
// app.options("*", cors({
//   origin: CLIENT_URL,
//   credentials: true,
// }));


// Test DB
(async () => {
  try {

    await sequelize.authenticate(); 
    console.log('Connexion OK')

    await sequelize.sync(); 
    console.log('Tables OK');

  } catch (error) {
    console.error ('Erreur Db' , error)
  }
})();

app.get("/api", (req, res) => {
  res.json({ message: "Hello world!", env: process.env.NODE_ENV });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  console.log("Mode :", process.env.NODE_ENV);
});
