import type { Lang } from "./site";

// Each slot belongs to one page; translated versions share the same artwork.
export const supportingImages = {
  "home-outdoor": {
    "src": "/images/editorial-home-outdoor.webp",
    "alt": {
      "en": "Garden sauna concept at blue hour with warm interior light.",
      "fr": "Concept de sauna de jardin à l’heure bleue, éclairé de l’intérieur."
    }
  },
  "home-indoor": {
    "src": "/images/editorial-home-indoor.webp",
    "alt": {
      "en": "Pale timber sauna viewed through a glass doorway.",
      "fr": "Sauna en bois clair vu à travers une porte vitrée."
    }
  },
  "home-infrared": {
    "src": "/images/editorial-home-infrared.webp",
    "alt": {
      "en": "Timber infrared cabin with recessed dark panels.",
      "fr": "Cabine infrarouge en bois avec panneaux foncés encastrés."
    }
  },
  "home-cottage": {
    "src": "/images/editorial-home-cottage.webp",
    "alt": {
      "en": "Quiet lakeside deck beside a cottage sauna concept.",
      "fr": "Terrasse paisible au bord d’un lac près d’un concept de sauna de chalet."
    }
  },
  "home-commercial": {
    "src": "/images/editorial-home-commercial.webp",
    "alt": {
      "en": "Spa relaxation room with a sauna entrance beyond.",
      "fr": "Salle de détente avec une entrée de sauna à l’arrière-plan."
    }
  },
  "browse-outdoor": {
    "src": "/images/editorial-browse-outdoor.webp",
    "alt": {
      "en": "Outdoor sauna concept among autumn birch trees.",
      "fr": "Concept de sauna extérieur parmi des bouleaux d’automne."
    }
  },
  "browse-indoor": {
    "src": "/images/editorial-browse-indoor.webp",
    "alt": {
      "en": "Traditional sauna concept with corner benches and a high window.",
      "fr": "Concept de sauna traditionnel avec banquettes d’angle et fenêtre haute."
    }
  },
  "browse-infrared": {
    "src": "/images/editorial-browse-infrared.webp",
    "alt": {
      "en": "Infrared cabin concept beside a home exercise space.",
      "fr": "Concept de cabine infrarouge près d’un espace d’exercice à la maison."
    }
  },
  "browse-cottage": {
    "src": "/images/editorial-browse-cottage.webp",
    "alt": {
      "en": "Cottage sauna concept beside a cleared winter path.",
      "fr": "Concept de sauna de chalet près d’un sentier déneigé."
    }
  },
  "browse-commercial": {
    "src": "/images/editorial-browse-commercial.webp",
    "alt": {
      "en": "Spacious hospitality sauna concept with a clear central aisle.",
      "fr": "Concept de sauna d’hébergement avec allée centrale dégagée."
    }
  },
  "browse-heaters": {
    "src": "/images/editorial-browse-heaters.webp",
    "alt": {
      "en": "Natural sauna stones in an unbranded heater.",
      "fr": "Pierres naturelles de sauna dans un chauffe-sauna sans marque."
    }
  },
  "home-guide-budget": {
    "src": "/images/editorial-home-guide-budget.webp",
    "alt": {
      "en": "Wood sample fan and a blank planning notebook.",
      "fr": "Nuancier de bois et carnet de planification vierge."
    }
  },
  "home-guide-delivery": {
    "src": "/images/editorial-home-guide-delivery.webp",
    "alt": {
      "en": "Plain shipping crate beside a clear covered porch.",
      "fr": "Caisse de livraison sobre près d’un porche dégagé."
    }
  },
  "home-guide-commercial": {
    "src": "/images/editorial-home-guide-commercial.webp",
    "alt": {
      "en": "Towel storage beside a timber wellness corridor.",
      "fr": "Rangement de serviettes près d’un corridor bien-être en bois."
    }
  },
  "index-guide-budget": {
    "src": "/images/editorial-index-guide-budget.webp",
    "alt": {
      "en": "Timber, siding and stone samples for project planning.",
      "fr": "Échantillons de bois, de revêtement et de pierre pour planifier un projet."
    }
  },
  "index-guide-delivery": {
    "src": "/images/editorial-index-guide-delivery.webp",
    "alt": {
      "en": "Wide open gates and a level gravel access route.",
      "fr": "Portails grands ouverts et accès plat en gravier."
    }
  },
  "index-guide-commercial": {
    "src": "/images/editorial-index-guide-commercial.webp",
    "alt": {
      "en": "Consultation table with blank plans and timber samples.",
      "fr": "Table de consultation avec plans vierges et échantillons de bois."
    }
  }
} as const;

export type SupportingImageKey = keyof typeof supportingImages;
export function supportingImage(key: SupportingImageKey, lang: Lang) {
  const image = supportingImages[key];
  return { src: image.src, alt: image.alt[lang] };
}

