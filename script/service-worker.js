const assets = [
  "service-worker.js",
  "companies.html",
  "company-profile.html",
  "create-an-account.html",
  "create-company.html",
  "internship-page.html",
  "internships.html",
  "login.html",
  "modify-an-account.html",
  "statistics.html",
  "users.html",
  "users-profile.html",
  "style.css",
  "About.php",
  "Erreur.php",
  "Legal.php",
  // img
  "img/SmallTile.scale-100.png",
  "img/SmallTile.scale-125.png",
  "img/SmallTile.scale-150.png",
  "img/SmallTile.scale-200.png",
  "img/SmallTile.scale-400.png",
  "img/Square150x150Logo.scale-100.png",
  "img/Square150x150Logo.scale-125.png",
  "img/Square150x150Logo.scale-150.png",
  "img/Square150x150Logo.scale-200.png",
  "img/Square150x150Logo.scale-400.png",
  "img/Wide310x150Logo.scale-100.png",
  "img/Wide310x150Logo.scale-125.png",
  "img/Wide310x150Logo.scale-150.png",
  "img/Wide310x150Logo.scale-200.png",
  "img/Wide310x150Logo.scale-400.png",
  "img/LargeTile.scale-100.png",
  "img/LargeTile.scale-125.png",
  "img/LargeTile.scale-150.png",
  "img/LargeTile.scale-200.png",
  "img/LargeTile.scale-400.png",
  "img/Square44x44Logo.scale-100.png",
  "img/Square44x44Logo.scale-125.png",
  "img/Square44x44Logo.scale-150.png",
  "img/Square44x44Logo.scale-200.png",
  "img/Square44x44Logo.scale-400.png",
  "img/StoreLogo.scale-100.png",
  "img/StoreLogo.scale-125.png",
  "img/StoreLogo.scale-150.png",
  "img/StoreLogo.scale-200.png",
  "img/StoreLogo.scale-400.png",
  "img/SplashScreen.scale-100.png",
  "img/SplashScreen.scale-125.png",
  "img/SplashScreen.scale-150.png",
  "img/SplashScreen.scale-200.png",
  "img/SplashScreen.scale-400.png",
  "img/Square44x44Logo.targetsize-16.png",
  "img/Square44x44Logo.targetsize-20.png",
  "img/Square44x44Logo.targetsize-24.png",
  "img/Square44x44Logo.targetsize-30.png",
  "img/Square44x44Logo.targetsize-32.png",
  "img/Square44x44Logo.targetsize-36.png",
  "img/Square44x44Logo.targetsize-40.png",
  "img/Square44x44Logo.targetsize-44.png",
  "img/Square44x44Logo.targetsize-48.png",
  "img/Square44x44Logo.targetsize-60.png",
  "img/Square44x44Logo.targetsize-64.png",
  "img/Square44x44Logo.targetsize-72.png",
  "img/Square44x44Logo.targetsize-80.png",
  "img/Square44x44Logo.targetsize-96.png",
  "img/Square44x44Logo.targetsize-256.png",
  "img/Square44x44Logo.altform-unplated_targetsize-16.png",
  "img/Square44x44Logo.altform-unplated_targetsize-20.png",
  "img/Square44x44Logo.altform-unplated_targetsize-24.png",
  "img/Square44x44Logo.altform-unplated_targetsize-30.png",
  "img/Square44x44Logo.altform-unplated_targetsize-32.png",
  "img/Square44x44Logo.altform-unplated_targetsize-36.png",
  "img/Square44x44Logo.altform-unplated_targetsize-40.png",
  "img/Square44x44Logo.altform-unplated_targetsize-44.png",
  "img/Square44x44Logo.altform-unplated_targetsize-48.png",
  "img/Square44x44Logo.altform-unplated_targetsize-60.png",
  "img/Square44x44Logo.altform-unplated_targetsize-64.png",
  "img/Square44x44Logo.altform-unplated_targetsize-72.png",
  "img/Square44x44Logo.altform-unplated_targetsize-80.png",
  "img/Square44x44Logo.altform-unplated_targetsize-96.png",
  "img/Square44x44Logo.altform-unplated_targetsize-256.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-16.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-20.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-24.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-30.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-32.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-36.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-40.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-44.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-48.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-60.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-64.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-72.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-80.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-96.png",
  "img/Square44x44Logo.altform-lightunplated_targetsize-256.png",
  // //api
  // "api/index.php",
  // "api/composer.json",
  // //  api/src
  // "api/src/AuthController.php",
  // "api/src/AuthModel.php",
  // "api/src/BusinessSectorController.php",
  // "api/src/BusinessSectorModel.php",
  // "api/src/CenterController.php",
  // "api/src/CenterModel.php",
  // "api/src/CityController.php",
  // "api/src/CityModel.php",
  // "api/src/CompanyController.php",
  // "api/src/CompanyLocationController.php",
  // "api/src/CompanyLocationModel.php",
  // "api/src/CompanyModel.php",
  // "api/src/CompanyReviewController.php",
  // "api/src/CompanyReviewModel.php",
  // "api/src/Config.php",
  // "api/src/Database.php",
  // "api/src/DataValidator.php",
  // "api/src/ErrorHandler.php",
  // "api/src/Filter.php",
  // "api/src/InternshipOfferController.php",
  // "api/src/InternshipOfferModel.php",
  // "api/src/Model.php",
  // "api/src/Paging.php",
  // "api/src/RelatedClassController.php",
  // "api/src/RelatedClassModel.php",
  // "api/src/RequiredSkillsController.php",
  // "api/src/RequiredSkillsModel.php",
  // "api/src/RoleController.php",
  // "api/src/RoleModel.php",
  // "api/src/SkillController.php",
  // "api/src/SkillModel.php",
  // "api/src/Sorting.php",
  // "api/src/StatController.php",
  // "api/src/StatModel.php",
  // "api/src/UserController.php",
  // "api/src/UserModel.php",
  // "api/src/WishlistController.php",
  // "api/src/WishlistModel.php",
  // //components
  // "components/company.html",
  // "components/footer.html",
  // "components/infoDocument.html",
  // "components/internship-offer.html",
  // "components/navbar.html",
  // "components/paging.html",
  // "components/rating.html",
  // "components/sorting.html",
  // "components/user.html",
  //font
  //"font/.html",
  //"font/.html",
  //script
  "script/api-handler.js",
  "script/components.js",
  "script/create-account.js",
  "script/edit-menu.js",
  "script/effects.js",
  "script/input-validation.js",
  "script/load-companies.js",
  "script/load-company-profile.js",
  "script/load-internship.js",
  "script/load-internship-page.js",
  "script/load-ratings.js",
  "script/load-stats.js",
  "script/load-user-profile.js",
  "script/load-users.js",
  "script/sorting-categories.js",
  "script/switching-tabs.js",
  // script/chart
  "script/chart/chart.js",
  // script/jquery
  "script/jquery/jquery-3.7.1.js",
  //vendor
  "vendor/autoload.php",
  //  vendor/composer
  "vendor/composer/installed.json",
  "vendor/composer/autoload_classmap.php",
  "vendor/composer/autoload_files.php",
  "vendor/composer/autoload_namespaces.php",
  "vendor/composer/autoload_psr4.php",
  "vendor/composer/autoload_real.php",
  "vendor/composer/autoload_static.php",
  "vendor/composer/ClassLoader.php",
  "vendor/composer/installed.php",
  "vendor/composer/InstalledVersions.php",
  "vendor/composer/platform_check.php",
]

const nom_cache = 'ProjectWeb';

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(nom_cache);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(nom_cache);
  await cache.put(request, response);
};
  
const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // Pour commencer on essaie d'obtenir la ressource depuis le cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Ensuite, on tente d'utiliser et de mettre en cache
  // la réponse préchargée si elle existe
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Ensuite, on tente de l'obtenir du réseau
  try {
    const responseFromNetwork = await fetch(request);
    // Une réponse ne peut être utilisée qu'une fois
    // On la clone pour en mettre une copie en cache
    // et servir l'originale au navigateur
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // Quand il n'y a même pas de contenu par défaut associé
    // on doit tout de même renvoyer un objet Response
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

// On active le préchargement à la navigation
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache(assets)
  );
  console.log('INSTALL', event);
});

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
  console.log('ACTIVATE', event);
});


self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: 'Erreur.php',
    }),
  );
  console.log('FETCH', event.request.url);
});
