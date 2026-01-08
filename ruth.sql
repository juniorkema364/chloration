-- --------------------------------------------------------
-- Hôte:                         C:\Users\Pc\Documents\Web project 2025\Novembre\Chlore\backend\placide.db
-- Version du serveur:           3.45.3
-- SE du serveur:                
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES  */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Listage des données de la table placide.Analyses : 14 rows
/*!40000 ALTER TABLE "Analyses" DISABLE KEYS */;
INSERT INTO "Analyses" ("id", "turbidity", "color", "odor", "temperature", "flowRate", "pH", "salinity", "conductivity", "nitrates", "nitrites", "iron", "manganese", "heavyMetals", "pesticides", "eColi", "fecalColiformes", "enterocoque", "parasites", "chloreDose", "chloreType", "volumeTraite", "contactTime", "chloreResiduel", "turbidityAfter", "pHAfter", "eColiAfter", "potable", "reasons", "analysisDate", "createdAt", "updatedAt", "ForageId", "UserId") VALUES
	(1, 1.0, 'bleu', '3', 2.0, 2.0, 1.0, 3.0, 4.0, 4.0, 4.0, 3.0, 3.0, NULL, NULL, true,false , false , false ,  1.0, 'hypochlorythe  de sodium', 1.0, 12.0, 1.0, 1.0, 1 ,false , false , false ,  '["pH 1 hors limites [6.5-8.5]","Salinité 3 g/L > 1 g/L","Nitrites 4 mg/L > 0.1 mg/L","Fer 3 mg/L > 0.3 mg/L","Manganèse 3 mg/L > 0.4 mg/L","Présence d''E. coli détectée"]', '2026-01-05 01:44:18.589 +00:00', '2026-01-05 01:44:18.610 +00:00', '2026-01-05 01:44:18.610 +00:00', 1, 1),
	(2, 11.0, 'Bleu', 'j', 1.0, 1.0, 3.0, 4.0, 46.0, 43.0, 0.6, 2.0, 5.0, NULL, NULL, true,false , false , false ,  2.0, 'chloride', 1.0, 24.0, 0.4, 1.0, 4.0, 1, 0, '["pH 3 hors limites [6.5-8.5]","Turbidité 11 NTU > 5 NTU","Salinité 4 g/L > 1 g/L","Nitrites 0.6 mg/L > 0.1 mg/L","Fer 2 mg/L > 0.3 mg/L","Manganèse 5 mg/L > 0.4 mg/L","Présence d''E. coli détectée","E. coli détecté après traitement"]', '2026-01-05 01:47:55.182 +00:00', '2026-01-05 01:47:55.187 +00:00', '2026-01-05 01:47:55.187 +00:00', 1, 1),
	(3, 1.0, 'b', '2', 2.0, 11.0, 2.0, 3.0, 4.0, 2.0, 2.0, 2.0, 2.0, NULL, NULL, false,false , false , false ,  3.0, 'hI', 2.0, 2.0, 2.0, 2.0, 3.0, 1, 0, '["pH 2 hors limites [6.5-8.5]","Salinité 3 g/L > 1 g/L","Nitrites 2 mg/L > 0.1 mg/L","Fer 2 mg/L > 0.3 mg/L","Manganèse 2 mg/L > 0.4 mg/L","E. coli détecté après traitement"]', '2026-01-05 01:51:02.802 +00:00', '2026-01-05 01:51:02.812 +00:00', '2026-01-05 01:51:02.812 +00:00', 3, 1),
	(4, 2.0, 'Incolore', 'Aucun', 20.0, 1.0, 7.0, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false, true , false , true ,  1.5, 'chloride', 1.0, 24.0, 0.1, 1.0, 7 , false , false , false ,  '["Présence de coliformes fécaux","Présence de parasites","Chlore résiduel 0.1 mg/L < 0.2 mg/L"]', '2026-01-05 02:07:13.549 +00:00', '2026-01-05 02:07:13.562 +00:00', '2026-01-05 02:07:13.562 +00:00', 1, 1),
	(5, 2.0, 'Incolore', 'Aucun', 20.0, 1.0, 7.0, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false, true , false , true ,  1.5, 'chloride', 1.0, 24.0, 0.1, 1.0, 7 , false , false , false ,  '["Présence de coliformes fécaux","Présence de parasites","Chlore résiduel 0.1 mg/L < 0.2 mg/L"]', '2026-01-05 02:07:22.947 +00:00', '2026-01-05 02:07:22.948 +00:00', '2026-01-05 02:07:22.948 +00:00', 1, 1),
	(6, 2.0, 'Incolore', 'Aucun', 20.0, 1.0, 7.0, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false, true , false , true ,  1.5, 'chloride', 1.0, 24.0, 0.1, 1.0, 7 , false , false , false ,  '["Présence de coliformes fécaux","Présence de parasites","Chlore résiduel 0.1 mg/L < 0.2 mg/L"]', '2026-01-05 02:07:27.771 +00:00', '2026-01-05 02:07:27.772 +00:00', '2026-01-05 02:07:27.772 +00:00', 1, 1),
	(7, 2.0, 'Incolore', 'Aucun', 20.0, 1.0, 7.0, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false, true , false , true ,  1.5, 'chloride', 1.0, 24.0, 0.1, 1.0, 7 , false , false , false ,  '["Présence de coliformes fécaux","Présence de parasites","Chlore résiduel 0.1 mg/L < 0.2 mg/L"]', '2026-01-05 02:07:37.427 +00:00', '2026-01-05 02:07:37.427 +00:00', '2026-01-05 02:07:37.427 +00:00', 1, 1),
	(8, 2.0, 'Incolore', 'Aucun', 20.0, 1.0, 7.0, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false, true , false , true ,  1.5, 'chloride', 1.0, 24.0, 0.1, 1.0, 7 , false , false , false ,  '["Présence de coliformes fécaux","Présence de parasites","Chlore résiduel 0.1 mg/L < 0.2 mg/L"]', '2026-01-05 02:15:23.544 +00:00', '2026-01-05 02:15:23.642 +00:00', '2026-01-05 02:15:23.642 +00:00', 1, 1),
	(9, 2.0, 'Clair', 'Aucun', 20.0, 1.0, 7.2, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false,false , false , false ,  1.5, 'chloride', 1.0, 24.0, 0.25, 1.0, 7.1, 0, 1, '[]', '2026-01-05 02:24:00.535 +00:00', '2026-01-05 02:24:00.549 +00:00', '2026-01-05 02:24:00.549 +00:00', 1, 1),
	(10, 2.0, 'Clair', 'Aucun', 20.0, 1.0, 7.2, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false,false , false , false ,  1.5, 'chloride', 1.0, 24.0, 0.25, 1.0, 7.1, 0, 1, '[]', '2026-01-05 02:24:08.586 +00:00', '2026-01-05 02:24:08.587 +00:00', '2026-01-05 02:24:08.587 +00:00', 1, 1),
	(11, 2.0, 'Clair', 'Aucun', 20.0, 1.0, 7.2, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false,false , false , false ,  1.5, 'chloride', 1.0, 24.0, 0.25, 1.0, 7.1, 0, 1, '[]', '2026-01-05 02:24:12.424 +00:00', '2026-01-05 02:24:12.424 +00:00', '2026-01-05 02:24:12.424 +00:00', 1, 1),
	(12, 2.0, 'Clair', 'Aucun', 20.0, 1.0, 7.2, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false,false , false , false ,  1.5, 'chloride', 1.0, 24.0, 0.25, 1.0, 7.1, 0, 1, '[]', '2026-01-05 02:26:36.780 +00:00', '2026-01-05 02:26:36.790 +00:00', '2026-01-05 02:26:36.790 +00:00', 2, 1),
	(13, 2.0, 'Clair', 'Aucun', 20.0, 1.0, 7.2, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false,false , false , false ,  1.5, 'chloride', 1.0, 24.0, 0.25, 1.0, 7.1, 0, 1, '[]', '2026-01-05 02:26:45.382 +00:00', '2026-01-05 02:26:45.383 +00:00', '2026-01-05 02:26:45.383 +00:00', 2, 1),
	(14, 2.0, 'Clair', 'Aucun', 20.0, 1.0, 7.2, 0.5, 100.0, 20.0, 0.05, 0.2, 0.3, NULL, NULL, false,false , false , false ,  1.5, 'chloride', 1.0, 24.0, 0.25, 1.0, 7.1, 0, 1, '[]', '2026-01-05 02:26:51.679 +00:00', '2026-01-05 02:26:51.679 +00:00', '2026-01-05 02:26:51.679 +00:00', 2, 1);
/*!40000 ALTER TABLE "Analyses" ENABLE KEYS */;

-- Listage des données de la table placide.Forages : -1 rows
/*!40000 ALTER TABLE "Forages" DISABLE KEYS */;
INSERT INTO "Forages" ("id", "forageId", "name", "location", "depth", "serviceDate", "owner", "status", "createdAt", "updatedAt", "UserId") VALUES
	(1, '1', 'ASPC', 'Paris', 32.0, '2025-07-01 00:00:00.000 +00:00', 'KEMA Didier ', 'active', '2026-01-05 01:15:27.391 +00:00', '2026-01-05 01:15:27.391 +00:00', 1),
	(2, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2026-01-05 01:29:40.023 +00:00', '2026-01-05 01:29:40.023 +00:00', 1),
	(3, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2026-01-05 01:30:25.563 +00:00', '2026-01-05 01:30:25.563 +00:00', 1),
	(4, NULL, NULL, NULL, NULL, NULL, NULL, 'active', '2026-01-05 01:30:36.483 +00:00', '2026-01-05 01:30:36.483 +00:00', 1);
/*!40000 ALTER TABLE "Forages" ENABLE KEYS */;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
