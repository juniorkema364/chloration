// Backend Node.js - Évaluation de la potabilité de l'eau par chloration
// Stack : Node.js + Express.js + Sequelize (logique métier simplifiée)

// =========================
// 1. Initialisation
// =========================
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// Base SQLite (modifiable vers MySQL/PostgreSQL)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'water_quality.db'
});

// =========================
// 2. Modèle Sequelize
// =========================
const WaterSample = sequelize.define('WaterSample', {
  ph: { type: DataTypes.FLOAT, allowNull: false },
  turbidite: { type: DataTypes.FLOAT, allowNull: false }, // NTU
  salinite: { type: DataTypes.FLOAT, allowNull: false }, // g/L
  nitrates: { type: DataTypes.FLOAT, allowNull: false }, // mg/L
  temperature: { type: DataTypes.FLOAT }, // °C
  volume: { type: DataTypes.FLOAT, allowNull: false }, // L

  chloreDose: { type: DataTypes.FLOAT, allowNull: false }, // mg/L injecté
  tempsContact: { type: DataTypes.INTEGER, allowNull: false }, // minutes

  chloreResiduel: { type: DataTypes.FLOAT }, // mg/L après traitement
  eColiAvant: { type: DataTypes.BOOLEAN },
  eColiApres: { type: DataTypes.BOOLEAN }
});

// =========================
// 3. Règles métier (logique potabilité)
// =========================
function evaluatePotability(sample) {
  const result = {
    decision: null,
    code: null,
    messages: [],
    alertes: []
  };

  // PHASE 1 : Validation données minimales
  const requiredFields = ['ph','turbidite','salinite','nitrates','chloreResiduel','tempsContact','eColiApres'];
  for (const field of requiredFields) {
    if (sample[field] === undefined || sample[field] === null) {
      result.decision = 'ERREUR';
      result.code = 'ERR_DONNEES_MANQUANTES';
      result.messages.push(`Champ manquant : ${field}`);
      return result;
    }
  }

  // PHASE 2 : Eau traitable par chlore ?
  if (sample.turbidite > 5) {
    return { decision: 'NON_TRAITABLE', code: 'ERR_TURBIDITE', messages: ['Turbidité > 5 NTU'], alertes: [] };
  }
  if (sample.ph < 6.5 || sample.ph > 8.5) {
    return { decision: 'NON_TRAITABLE', code: 'ERR_PH', messages: ['pH hors norme'], alertes: [] };
  }
  if (sample.salinite >= 1) {
    return { decision: 'NON_TRAITABLE', code: 'ERR_SALINITE', messages: ['Salinité trop élevée'], alertes: [] };
  }
  if (sample.nitrates >= 50) {
    return { decision: 'NON_TRAITABLE', code: 'ERR_NITRATES', messages: ['Nitrates trop élevés'], alertes: [] };
  }

  // PHASE 3 : Vérification désinfection
  if (sample.tempsContact < 30) {
    return { decision: 'NON_POTABLE', code: 'ERR_TEMPS_CONTACT', messages: ['Temps de contact insuffisant'], alertes: [] };
  }

  // PHASE 4 : Analyse après chloration
  if (sample.eColiApres === true) {
    return { decision: 'NON_POTABLE', code: 'ERR_ECOLI', messages: ['Présence de bactéries après traitement'], alertes: [] };
  }

  if (sample.chloreResiduel < 0.2) {
    return { decision: 'NON_POTABLE', code: 'ERR_CHLORE_FAIBLE', messages: ['Chlore résiduel insuffisant'], alertes: [] };
  }

  if (sample.chloreResiduel > 0.5) {
    return { decision: 'NON_POTABLE', code: 'ERR_CHLORE_ELEVE', messages: ['Excès de chlore'], alertes: [] };
  }

  // ALERTES non bloquantes
  if (sample.fer && sample.fer > 0.3) result.alertes.push('WARN_FER_ELEVE');
  if (sample.manganese && sample.manganese > 0.1) result.alertes.push('WARN_MANGANESE_ELEVE');
  if (sample.ph > 8 || sample.ph < 6.7) result.alertes.push('WARN_PH_LIMITE');

  // PHASE 5 : Eau potable
  result.decision = 'POTABLE';
  result.code = 'EAU_POTABLE';
  result.messages.push('Tous les paramètres sont conformes');

  return result;
}
  }

  // Étape 2 : Vérification désinfection
  if (sample.tempsContact < 30) {
    return {
      potable: false,
      status: 'DESINFECTION INSUFFISANTE',
      raisons: ['Temps de contact insuffisant']
    };
  }

  // Étape 3 : Validation finale
  if (
    sample.chloreResiduel >= 0.2 &&
    sample.chloreResiduel <= 0.5 &&
    sample.eColiApres === false &&
    sample.turbidite <= 5
  ) {
    return {
      potable: true,
      status: 'EAU POTABLE',
      raisons: []
    };
  }

  return {
    potable: false,
    status: 'EAU NON POTABLE',
    raisons: ['Chlore résiduel ou microbiologie non conforme']
  };
}

// =========================
// 4. Routes API
// =========================

// Créer une analyse d'eau
app.post('/api/water-samples', async (req, res) => {
  try {
    const sample = await WaterSample.create(req.body);
    const evaluation = evaluatePotability(sample);

    res.json({
      data: sample,
      evaluation
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lister les analyses
app.get('/api/water-samples', async (req, res) => {
  const samples = await WaterSample.findAll();
  res.json(samples);
});

// =========================
// 5. Démarrage serveur
// =========================
(async () => {
  await sequelize.sync();
  app.listen(3000, () => {
    console.log('Serveur eau potable lancé sur http://localhost:3000');
  });
})();

/* =========================
   EXEMPLE DE JSON A ENVOYER
   =========================
{
  "ph": 7.2,
  "turbidite": 2.1,
  "salinite": 0.4,
  "nitrates": 20,
  "temperature": 26,
  "volume": 10000,
  "chloreDose": 2.5,
  "tempsContact": 40,
  "chloreResiduel": 0.3,
  "eColiAvant": true,
  "eColiApres": false
}
*/
