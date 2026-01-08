# -----------------------------
# Dockerfile pour Backend Express
# -----------------------------

# 1️⃣ Utiliser Node.js officiel (version stable)
FROM node:20

 
# 3️⃣ Copier uniquement package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# 4️⃣ Installer les dépendances en production
RUN npm install --production

# 5️⃣ Copier tout le code source dans le container
COPY . .

# 6️⃣ Définir la variable d'environnement PORT par défaut
ENV PORT=5000

# 7️⃣ Exposer le port du container
EXPOSE 8080



# 8️⃣ Commande pour démarrer l'application
CMD ["node", "app.js"]

# -----------------------------
# Instructions / Notes :
# -----------------------------
# 1️⃣ Assurez-vous que dans app.js vous utilisez :
#       const PORT = process.env.PORT || 5000;
#       app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
#
# 2️⃣ Variables d'environnement (à configurer dans Fly.io) :
#       - PROD_DB_HOST
#       - PROD_DB_NAME
#       - PROD_DB_USER
#       - PROD_DB_PASS
#       - JWT_SECRET
#       - CLIENT_URL
#       - NODE_ENV=production
#
# 3️⃣ Si vous avez besoin des devDependencies (tests, build) :
#       Remplacez "npm install --production" par "npm install"
#
# 4️⃣ Dockerfile + Fly.io vous permet de ne PAS installer Docker localement.
# 5️⃣ Optionnel : créez un fichier .dockerignore pour ignorer node_modules et logs :
#       node_modules
#       logs
#       *.log
#       .env
