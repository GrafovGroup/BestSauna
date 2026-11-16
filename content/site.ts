export type Lang = 'en' | 'fr';

export interface PageCopy {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  intro: string;
  image: string;
  imageAlt: string;
  sections: {
    eyebrow?: string;
    title: string;
    text?: string;
    bullets?: string[];
    items?: { title: string; text: string }[];
  }[];
  faq?: { q: string; a: string }[];
  related: string[];
}

export interface SitePage {
  key: string;
  paths: Record<Lang, string>;
  kind: 'category' | 'service' | 'compare' | 'guide-index' | 'guide' | 'coverage' | 'support' | 'quote' | 'about' | 'policy';
  copy: Record<Lang, PageCopy>;
}

export const pages: SitePage[] = [
  {
    key: "home",
    paths: { en: "/en/", fr: "/fr/" },
    kind: "category",
    copy: {
      en: {
        title: "Saunas for Homes, Cottages & Commercial Spaces | BestSauna.ca",
        description: "Explore sauna options for your home, cottage or business. Plan equipment, delivery and installation with a clear project quotation.",
        eyebrow: "A SPACE TO SLOW DOWN",
        heading: "Find the right sauna for your space.",
        intro: "Explore saunas for your home, cottage or business. Start with your space, how you plan to use it and the level of help you need.",
        image: "/images/hero-sauna.webp",
        imageAlt: "Outdoor sauna setting with warm timber and a quiet natural backdrop",
        sections: [
          { title: "Your space. Your way to unwind.", text: "A backyard retreat, an indoor renovation or a cottage project starts with a few useful decisions. Compare formats, consider the site and choose the scope that fits your plans." },
          { title: "A clear path from idea to quotation", text: "Tell us about the location, preferred sauna and help you need. Product options, delivery arrangements and available installation services are confirmed for your project." }
        ],
        related: ["saunas", "installation", "quote"]
      },
      fr: {
        title: "Saunas pour la maison, le chalet et les entreprises | BestSauna.ca",
        description: "Explorez les options de sauna pour votre maison, votre chalet ou votre entreprise. Préparez votre projet et demandez une soumission détaillée.",
        eyebrow: "UN ESPACE POUR RALENTIR",
        heading: "Trouvez le sauna qui convient à votre espace.",
        intro: "Explorez les saunas pour la maison, le chalet ou les espaces commerciaux. Partez de votre espace, de l’usage prévu et de l’accompagnement souhaité.",
        image: "/images/hero-sauna.webp",
        imageAlt: "Aménagement de sauna extérieur en bois dans un cadre naturel paisible",
        sections: [
          { title: "Votre espace. Votre moment de détente.", text: "Un coin de repos dans la cour, une rénovation intérieure ou un projet au chalet commence par quelques choix utiles. Comparez les formats, examinez l’emplacement et choisissez l’accompagnement qui répond à vos besoins." },
          { title: "De l’idée à une soumission claire", text: "Décrivez l’emplacement, le type de sauna et l’aide souhaitée. Les options de produit, les modalités de livraison et les services d’installation offerts sont confirmés pour votre projet." }
        ],
        related: ["saunas", "installation", "quote"]
      }
    }
  },
  {
    key: "saunas",
    paths: { en: "/en/saunas/", fr: "/fr/saunas/" },
    kind: "category",
    copy: {
      en: {
        title: "Explore Sauna Types & Project Options | BestSauna.ca",
        description: "Compare outdoor, indoor and infrared sauna options. Start with your space, preferred layout and project scope before choosing a model.",
        eyebrow: "EXPLORE SAUNAS",
        heading: "Start with the way you want to use your space.",
        intro: "The right starting point is your project: where the sauna will go, who will use it and how much of the work you want coordinated.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Timber seating and interior details in a sauna setting",
        sections: [
          { title: "Three useful starting points", items: [
            { title: "Outdoors", text: "Explore cabin, cube and barrel formats for a backyard or cottage. Consider the complete footprint, access route and the work required at the proposed location." },
            { title: "Indoors", text: "Plan a sauna around the room and renovation scope. Compare a freestanding cabin with a kit that becomes part of a prepared interior space." },
            { title: "Infrared", text: "Compare an infrared cabin by its intended location, actual seating, controls and complete installation requirements. Use documentation for the specific model." }
          ] },
          { title: "Look beyond the headline size", text: "A capacity label is only one part of the decision. Ask for internal dimensions and bench layouts, then consider how you prefer to sit and the room you need to enter and move around.", bullets: ["Measure the available space and the route to it.", "Decide which equipment and accessories belong in the quotation.", "Separate supply, delivery, assembly and specialist work."] },
          { title: "Build a shortlist around your priorities", text: "Tell us whether space, appearance, seating or project coordination matters most. A useful shortlist explains what is included, what needs preparation and what remains to be confirmed for your address." }
        ],
        faq: [
          { q: "Do I need to know the exact model before enquiring?", a: "No. Share the location, intended use and approximate available space. You can ask for help comparing suitable formats before selecting a configuration." },
          { q: "Are the categories a list of products currently in stock?", a: "The categories explain different project options. Specific models, configurations and availability are confirmed in your quotation." }
        ],
        related: ["outdoor", "indoor", "infrared", "compare", "quote"]
      },
      fr: {
        title: "Types de saunas et options de projet | BestSauna.ca",
        description: "Comparez les saunas extérieurs, intérieurs et infrarouges. Définissez l’espace, l’aménagement et les travaux avant de choisir un modèle.",
        eyebrow: "EXPLORER LES SAUNAS",
        heading: "Commencez par l’usage que vous souhaitez faire de votre espace.",
        intro: "Votre projet guide le choix : l’emplacement du sauna, les personnes qui l’utiliseront et les travaux que vous souhaitez faire coordonner.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Banquettes en bois et détails d’un aménagement intérieur de sauna",
        sections: [
          { title: "Trois points de départ utiles", items: [
            { title: "À l’extérieur", text: "Explorez les formats cabine, cube et tonneau pour la cour ou le chalet. Pensez à l’encombrement total, au trajet d’accès et aux travaux à prévoir à l’emplacement choisi." },
            { title: "À l’intérieur", text: "Planifiez le sauna selon la pièce et les rénovations prévues. Comparez une cabine autonome avec un ensemble à intégrer à un espace intérieur préparé." },
            { title: "À infrarouge", text: "Évaluez une cabine infrarouge selon son emplacement prévu, ses places assises, ses commandes et les exigences d’installation du modèle précis." }
          ] },
          { title: "Examinez plus que la capacité annoncée", text: "Le nombre de personnes indiqué ne dit pas tout. Demandez les dimensions intérieures et le plan des banquettes, puis pensez à votre position préférée et à l’espace nécessaire pour entrer et circuler.", bullets: ["Mesurez l’espace disponible et le trajet pour y accéder.", "Précisez les équipements et accessoires à inclure dans la soumission.", "Distinguez la fourniture, la livraison, l’assemblage et les travaux spécialisés."] },
          { title: "Une sélection fondée sur vos priorités", text: "Indiquez ce qui compte le plus : l’espace, le style, les places assises ou la coordination du projet. Une sélection utile précise les inclusions, la préparation nécessaire et les points à confirmer pour votre adresse." }
        ],
        faq: [
          { q: "Faut-il connaître le modèle exact avant de faire une demande?", a: "Non. Décrivez l’emplacement, l’usage prévu et l’espace approximatif. Vous pouvez demander de l’aide pour comparer les formats avant de choisir une configuration." },
          { q: "Les catégories présentent-elles des produits en stock?", a: "Les catégories expliquent les options de projet. Les modèles précis, les configurations et la disponibilité sont confirmés dans votre soumission." }
        ],
        related: ["outdoor", "indoor", "infrared", "compare", "quote"]
      }
    }
  },
  {
    key: "outdoor",
    paths: { en: "/en/saunas/outdoor/", fr: "/fr/saunas/exterieurs/" },
    kind: "category",
    copy: {
      en: {
        title: "Outdoor Sauna Planning for Backyards & Cottages | BestSauna.ca",
        description: "Explore outdoor cabin, cube and barrel sauna formats. Plan the footprint, delivery access, base and installation scope for your project.",
        eyebrow: "OUTDOOR SAUNAS",
        heading: "Make room for a sauna outdoors.",
        intro: "A well-planned outdoor sauna belongs in its setting. Start with the site, the layout you want and the practical route from delivery to placement.",
        image: "/images/outdoor.webp",
        imageAlt: "Outdoor timber sauna in a landscaped natural setting",
        sections: [
          { title: "Choose a format that fits the setting", items: [
            { title: "Cabin and cube", text: "Compare the interior plan, glazing, entrance and bench arrangement. Check the complete external dimensions rather than relying on a photograph." },
            { title: "Barrel", text: "Look closely at usable interior space, the doorway, benches and the supplied exterior protection. Compare the actual configuration with a cabin of interest." },
            { title: "Entrance or changing area", text: "If you want a separate place for towels or changing, include it in the initial footprint and equipment scope." }
          ] },
          { title: "Plan the location before the order", text: "Measure the proposed position and the access route. Gates, corners, slopes and the delivery vehicle’s stopping point can change the handling plan. The base and any specialist work need to suit the selected model and site.", bullets: ["Confirm the full footprint and required clearances from the model documents.", "Identify who prepares the base and moves the shipment into position.", "Ask what the heater package includes and which connections remain separate."] },
          { title: "Define the level of help", text: "You may want equipment and delivery only, an assembled kit or a coordinated installation project. The quotation should make the delivery point, handling, assembly and remaining work easy to distinguish." }
        ],
        faq: [
          { q: "Can an outdoor sauna be used at my specific location?", a: "The product’s intended use and installation documents need to be checked against the site. Share the location, photos and any access restrictions before selecting a final configuration." },
          { q: "Does delivery include moving it into the backyard?", a: "Only when that handling is expressly included. Delivery to an agreed unloading point and placement in the final position are separate parts of the scope." }
        ],
        related: ["cottage", "compare", "installation", "guide-delivery", "quote"]
      },
      fr: {
        title: "Saunas extérieurs pour la cour et le chalet | BestSauna.ca",
        description: "Explorez les formats cabine, cube et tonneau. Planifiez l’emplacement, l’accès, la base et les travaux d’installation de votre sauna extérieur.",
        eyebrow: "SAUNAS EXTÉRIEURS",
        heading: "Faites une place au sauna à l’extérieur.",
        intro: "Un sauna extérieur bien planifié s’intègre à son environnement. Commencez par le terrain, l’aménagement souhaité et le trajet entre la livraison et l’emplacement final.",
        image: "/images/outdoor.webp",
        imageAlt: "Sauna extérieur en bois dans un aménagement paysager naturel",
        sections: [
          { title: "Choisissez un format adapté au lieu", items: [
            { title: "Cabine et cube", text: "Comparez le plan intérieur, le vitrage, l’entrée et les banquettes. Vérifiez les dimensions extérieures complètes plutôt que de vous fier à une photo." },
            { title: "Tonneau", text: "Examinez l’espace intérieur utilisable, la porte, les banquettes et la protection extérieure fournie. Comparez la configuration précise avec celle d’une cabine." },
            { title: "Entrée ou vestiaire", text: "Si vous souhaitez un espace séparé pour les serviettes ou pour vous changer, intégrez-le dès le départ aux dimensions et à la portée du projet." }
          ] },
          { title: "Préparez l’emplacement avant la commande", text: "Mesurez l’emplacement et le trajet d’accès. Les portails, les virages, les pentes et l’endroit où le camion s’arrêtera peuvent modifier le plan de manutention. La base et les travaux spécialisés doivent convenir au modèle et au terrain.", bullets: ["Confirmez les dimensions et les dégagements indiqués dans la documentation du modèle.", "Déterminez qui prépare la base et déplace l’envoi jusqu’à son emplacement.", "Vérifiez les inclusions du système de chauffage et les raccordements à prévoir."] },
          { title: "Définissez l’accompagnement souhaité", text: "Vous pouvez demander l’équipement et la livraison, l’assemblage d’un ensemble ou un projet d’installation coordonné. La soumission doit distinguer clairement la livraison, la manutention, l’assemblage et les travaux restants." }
        ],
        faq: [
          { q: "Un sauna extérieur convient-il à mon emplacement?", a: "L’usage prévu du produit et ses instructions d’installation doivent être examinés selon le terrain. Transmettez l’emplacement, des photos et les contraintes d’accès avant de retenir une configuration." },
          { q: "La livraison comprend-elle le déplacement dans la cour?", a: "Seulement si cette manutention est expressément incluse. La livraison au point de déchargement et la mise en place finale constituent des éléments distincts." }
        ],
        related: ["cottage", "compare", "installation", "guide-delivery", "quote"]
      }
    }
  },
  {
    key: "indoor",
    paths: { en: "/en/saunas/indoor/", fr: "/fr/saunas/interieurs/" },
    kind: "category",
    copy: {
      en: {
        title: "Indoor Saunas & Home Sauna Project Planning | BestSauna.ca",
        description: "Plan an indoor sauna around your room, access and renovation scope. Compare freestanding cabins and traditional sauna kit projects.",
        eyebrow: "INDOOR SAUNAS",
        heading: "Give your sauna a place inside.",
        intro: "Whether it is part of a renovation or a room you already have, an indoor sauna should be planned around the space and the complete installation scope.",
        image: "/images/indoor.webp",
        imageAlt: "Contemporary indoor sauna with timber benches and glass detailing",
        sections: [
          { title: "Cabin or room-based project?", items: [
            { title: "Freestanding cabin", text: "Review the complete assembled dimensions, door movement and access for bringing components into the room. Confirm what preparation and connections the exact product requires." },
            { title: "Traditional sauna kit", text: "Define the prepared room, supplied materials and equipment together. Establish which parts of the surrounding construction are included and which remain with your renovation contractor." }
          ] },
          { title: "Measure more than floor space", text: "Room height, access through the home and the proposed bench arrangement all belong in the brief. Share a simple plan and photos before finalizing a configuration. Installation details should follow the selected manufacturer’s documents and the site assessment.", bullets: ["Record room dimensions, doorways and any stairs on the access route.", "Identify existing finishes and work already planned for the room.", "Confirm responsibilities for electrical work, ventilation and other model-specific requirements."] },
          { title: "Coordinate with the renovation", text: "A sauna quotation should fit the wider project schedule. Make it clear who prepares the space, when deliveries can be accepted and which contractor is responsible for each connection and finishing task. Decide whether you need supply only or a managed project scope." }
        ],
        faq: [
          { q: "Can I use a spare room or part of a basement?", a: "Potential locations should be assessed against the proposed product and existing construction. Start with dimensions, photos and the intended scope; do not assume every room is ready for the same kit." },
          { q: "Is an indoor sauna automatically a plug-in product?", a: "No assumption should be made from the category alone. Electrical and installation requirements must come from the documentation for the exact model." }
        ],
        related: ["infrared", "heaters", "installation", "guide-budget", "quote"]
      },
      fr: {
        title: "Saunas intérieurs et projets résidentiels | BestSauna.ca",
        description: "Planifiez un sauna intérieur selon la pièce, l’accès et les rénovations. Comparez les cabines autonomes et les ensembles de sauna traditionnel.",
        eyebrow: "SAUNAS INTÉRIEURS",
        heading: "Réservez une place au sauna dans la maison.",
        intro: "Qu’il fasse partie d’une rénovation ou d’une pièce existante, un sauna intérieur se planifie selon l’espace et l’ensemble des travaux d’installation.",
        image: "/images/indoor.webp",
        imageAlt: "Sauna intérieur contemporain avec banquettes en bois et détails vitrés",
        sections: [
          { title: "Cabine autonome ou pièce aménagée?", items: [
            { title: "Cabine autonome", text: "Examinez les dimensions une fois assemblée, l’ouverture de la porte et l’accès pour transporter les composants. Confirmez la préparation et les raccordements nécessaires pour le produit précis." },
            { title: "Ensemble de sauna traditionnel", text: "Définissez ensemble la pièce préparée, les matériaux fournis et l’équipement. Précisez les travaux de construction inclus et ceux qui restent à la charge de votre entrepreneur en rénovation." }
          ] },
          { title: "Mesurez plus que la surface au sol", text: "La hauteur de la pièce, le passage dans la maison et le plan des banquettes font partie du projet. Transmettez un croquis et des photos avant de retenir une configuration. Les travaux doivent suivre les documents du fabricant choisi et l’évaluation de l’emplacement.", bullets: ["Notez les dimensions de la pièce, des portes et des escaliers sur le trajet.", "Précisez les finis existants et les rénovations déjà prévues.", "Confirmez les responsabilités pour l’électricité, la ventilation et les autres exigences du modèle."] },
          { title: "Intégrez le sauna à la rénovation", text: "La soumission doit s’inscrire dans l’échéancier général. Déterminez qui prépare l’espace, quand la livraison peut être reçue et qui réalise chaque raccordement et travail de finition. Choisissez entre la fourniture seule et la coordination d’un projet défini." }
        ],
        faq: [
          { q: "Puis-je utiliser une pièce libre ou une partie du sous-sol?", a: "L’emplacement doit être évalué selon le produit envisagé et la construction existante. Commencez par les dimensions, des photos et la portée des travaux; toutes les pièces ne conviennent pas au même ensemble." },
          { q: "Un sauna intérieur se branche-t-il forcément dans une prise?", a: "Il ne faut pas le présumer. Les exigences électriques et d’installation doivent provenir de la documentation du modèle exact." }
        ],
        related: ["infrared", "heaters", "installation", "guide-budget", "quote"]
      }
    }
  },
  {
    key: "infrared",
    paths: { en: "/en/saunas/infrared/", fr: "/fr/saunas/infrarouges/" },
    kind: "category",
    copy: {
      en: {
        title: "Infrared Sauna Options & Buying Considerations | BestSauna.ca",
        description: "Explore infrared sauna cabins by size, layout, controls and installation needs. Compare documented features and the complete project scope.",
        eyebrow: "INFRARED SAUNAS",
        heading: "Choose the cabin around your priorities.",
        intro: "If you are considering infrared, focus on the cabin you will actually use: its seating, controls, intended location and the practical requirements of bringing it home.",
        image: "/images/infrared.webp",
        imageAlt: "Indoor sauna cabin with a calm timber interior",
        sections: [
          { title: "Compare the details you can verify", text: "Ask for the exact model documentation and a complete equipment list. Understand which features are included, how controls operate and whether any accessories are separate. Compare written specifications rather than broad wellness claims.", bullets: ["Usable seating, internal dimensions and entry space.", "Intended installation environment and electrical requirements.", "Included controls, lighting and other stated features.", "Manufacturer warranty terms and the route for obtaining parts or support."] },
          { title: "Plan for delivery and setup", text: "Check the packaged components as well as the finished cabin. Doorways, stairs and the route to the room can affect handling. The quotation should explain the delivery point, who moves the equipment inside and what assembly or specialist work is included." },
          { title: "Keep the choice practical", text: "Tell us how many people you want to seat, where the cabin will stand and whether you need help with assembly. If you are also considering a traditional sauna, compare both as complete projects rather than comparing their headline equipment prices alone." }
        ],
        faq: [
          { q: "Can an infrared cabin be placed outdoors?", a: "Only the exact model’s intended use and documentation can establish that. An indoor cabin should not be treated as an outdoor product simply because it can fit on a patio." },
          { q: "Are the controls and accessories always included?", a: "Inclusions vary by configuration. Ask for an itemized equipment list so you can compare cabins on the same basis and identify anything required separately." }
        ],
        related: ["indoor", "compare", "installation", "quote"]
      },
      fr: {
        title: "Saunas infrarouges : options et critères de choix | BestSauna.ca",
        description: "Explorez les cabines infrarouges selon leurs dimensions, leur aménagement, leurs commandes et leurs exigences d’installation.",
        eyebrow: "SAUNAS INFRAROUGES",
        heading: "Choisissez une cabine selon vos priorités.",
        intro: "Si vous envisagez l’infrarouge, concentrez-vous sur la cabine que vous utiliserez : ses places assises, ses commandes, son emplacement prévu et les travaux nécessaires pour l’installer.",
        image: "/images/infrared.webp",
        imageAlt: "Cabine de sauna intérieur avec un aménagement en bois sobre",
        sections: [
          { title: "Comparez des caractéristiques vérifiables", text: "Demandez la documentation du modèle exact et une liste complète de l’équipement. Vérifiez les fonctions incluses, le fonctionnement des commandes et les accessoires vendus séparément. Comparez les caractéristiques écrites plutôt que les promesses générales de bien-être.", bullets: ["Places assises utilisables, dimensions intérieures et espace d’entrée.", "Environnement d’installation prévu et exigences électriques.", "Commandes, éclairage et autres éléments annoncés comme inclus.", "Garantie du fabricant et démarches pour obtenir des pièces ou de l’assistance."] },
          { title: "Préparez la livraison et l’assemblage", text: "Examinez les composants emballés ainsi que la cabine terminée. Les portes, les escaliers et le trajet jusqu’à la pièce peuvent modifier la manutention. La soumission doit préciser le point de livraison, le déplacement à l’intérieur et les travaux inclus." },
          { title: "Gardez le choix concret", text: "Indiquez le nombre de places souhaité, l’endroit où la cabine sera installée et l’aide nécessaire pour l’assemblage. Si vous envisagez aussi un sauna traditionnel, comparez les projets complets, pas seulement le prix de l’équipement." }
        ],
        faq: [
          { q: "Peut-on installer une cabine infrarouge à l’extérieur?", a: "Seuls l’usage prévu et la documentation du modèle exact permettent de le confirmer. Une cabine intérieure ne devient pas un produit extérieur parce qu’elle entre sur une terrasse." },
          { q: "Les commandes et les accessoires sont-ils toujours inclus?", a: "Les inclusions varient selon la configuration. Demandez une liste détaillée pour comparer les cabines sur une même base et repérer les éléments à prévoir séparément." }
        ],
        related: ["indoor", "compare", "installation", "quote"]
      }
    }
  },
  {
    key: "cottage",
    paths: { en: "/en/cottage-saunas/", fr: "/fr/saunas-pour-chalet/" },
    kind: "category",
    copy: {
      en: {
        title: "Cottage Sauna Planning & Delivery Considerations | BestSauna.ca",
        description: "Plan a cottage sauna around your property, access and intended use. Define the equipment, delivery and installation scope before ordering.",
        eyebrow: "SAUNAS FOR THE COTTAGE",
        heading: "Make the sauna part of your cottage plans.",
        intro: "Start with how you use the property, where the sauna belongs and how the equipment will reach it. The delivery plan deserves as much attention as the design.",
        image: "/images/cottage.webp",
        imageAlt: "Cottage sauna setting surrounded by trees and natural materials",
        sections: [
          { title: "Plan around the property", text: "Share the address or location details early, including private roads, gates, steep sections and any seasonal access limits. If a shipment needs a transfer, special handling or another transport stage, that work should be identified before the order.", bullets: ["Measure the final position and the route from the unloading point.", "Explain when someone can receive the delivery and meet contractors.", "Identify the proposed base and the work needed to prepare it."] },
          { title: "Choose the equipment as a complete package", text: "Compare the sauna enclosure, heat configuration and necessary components together. For a wood-fired project, request the complete intended configuration and a site-specific installation assessment. For electric equipment, have the relevant installation requirements reviewed before committing to the location." },
          { title: "Personal retreat or guest accommodation?", text: "Tell us whether the sauna is for private use or a property offered to guests. The intended application affects the product and warranty questions that need answers. A residential description alone does not establish suitability for rental accommodation." },
          { title: "Keep the project manageable", text: "A useful quotation separates equipment, delivery, placement, assembly and specialist work. Align the schedule with property access and the people responsible for preparing the site." }
        ],
        faq: [
          { q: "Can I request delivery to a rural cottage?", a: "Yes, you can submit the location for assessment. The delivery route, service availability and cost are confirmed for the specific product and destination." },
          { q: "Can I place the sauna directly on an existing deck?", a: "The suitability of the proposed base must be assessed for the model and existing structure. Include deck details in the enquiry rather than assuming it is ready." }
        ],
        related: ["outdoor", "guide-delivery", "coverage", "commercial", "quote"]
      },
      fr: {
        title: "Planifier un sauna au chalet et sa livraison | BestSauna.ca",
        description: "Planifiez votre sauna au chalet selon le terrain, l’accès et l’usage prévu. Précisez l’équipement, la livraison et les travaux avant la commande.",
        eyebrow: "SAUNAS POUR LE CHALET",
        heading: "Intégrez le sauna à vos projets de chalet.",
        intro: "Partez de votre façon d’utiliser la propriété, de l’emplacement du sauna et du trajet pour y transporter l’équipement. La livraison mérite autant d’attention que le design.",
        image: "/images/cottage.webp",
        imageAlt: "Aménagement de sauna au chalet entouré d’arbres et de matériaux naturels",
        sections: [
          { title: "Tenez compte de la propriété", text: "Transmettez l’adresse ou les détails d’emplacement tôt dans le projet : chemin privé, portail, pente ou accès saisonnier. Si l’envoi exige un transfert, une manutention particulière ou une autre étape de transport, il faut le prévoir avant la commande.", bullets: ["Mesurez l’emplacement final et le trajet depuis le point de déchargement.", "Indiquez quand une personne peut recevoir la livraison et accueillir les entrepreneurs.", "Décrivez la base prévue et les travaux nécessaires à sa préparation."] },
          { title: "Choisissez un ensemble complet", text: "Comparez ensemble la cabine, le système de chauffage et les composants nécessaires. Pour un projet au bois, demandez la configuration complète et une évaluation de l’installation à cet endroit. Pour l’équipement électrique, faites examiner les exigences avant de retenir l’emplacement." },
          { title: "Usage personnel ou hébergement?", text: "Précisez si le sauna est réservé à votre usage ou destiné aux clients d’une propriété locative. L’application prévue détermine les questions à poser sur le produit et la garantie. Une description résidentielle ne confirme pas à elle seule la compatibilité avec l’hébergement." },
          { title: "Gardez une portée claire", text: "Une soumission utile distingue l’équipement, la livraison, la mise en place, l’assemblage et les travaux spécialisés. Coordonnez l’échéancier avec l’accès à la propriété et les personnes chargées de préparer le terrain." }
        ],
        faq: [
          { q: "Puis-je demander une livraison à un chalet en région?", a: "Oui, vous pouvez soumettre l’emplacement pour évaluation. Le trajet, la disponibilité du service et le coût sont confirmés selon le produit et la destination." },
          { q: "Puis-je installer le sauna directement sur une terrasse existante?", a: "La base doit être évaluée selon le modèle et la structure existante. Ajoutez les renseignements sur la terrasse à votre demande plutôt que de la présumer prête." }
        ],
        related: ["outdoor", "guide-delivery", "coverage", "commercial", "quote"]
      }
    }
  },
  {
    key: "commercial",
    paths: { en: "/en/commercial-saunas/", fr: "/fr/saunas-commerciaux/" },
    kind: "category",
    copy: {
      en: {
        title: "Commercial Sauna Project Enquiries | BestSauna.ca",
        description: "Prepare a sauna project for hospitality, fitness or shared facilities. Define intended use, equipment requirements, delivery and installation scope.",
        eyebrow: "COMMERCIAL PROJECTS",
        heading: "Start with how the facility will operate.",
        intro: "A commercial sauna project needs more than an attractive enclosure. Define the intended use, operating requirements and responsibilities before selecting equipment.",
        image: "/images/commercial.webp",
        imageAlt: "Sauna and relaxation setting suited to a hospitality design brief",
        sections: [
          { title: "Bring the operating brief into the discussion", text: "Tell us whether the project is for accommodation, a fitness facility, a spa, a condominium amenity or another shared setting. Include expected use, available space, proposed operating hours and whether this is new construction or a replacement." },
          { title: "Confirm suitability for the application", text: "The proposed configuration needs documentation for its intended use. Warranty terms, controls, support arrangements and installation requirements should be reviewed for the facility, not inferred from a residential product listing.", bullets: ["Share plans, dimensions and existing equipment information.", "Identify the project lead and the people approving the specification.", "State any procurement, access, scheduling or documentation requirements."] },
          { title: "Give each part of the work an owner", text: "Equipment supply, delivery, site preparation, assembly and specialist installation can involve different parties. A project quotation should identify each responsibility, the dependencies between tasks and the basis for any timing estimate." },
          { title: "Prepare for handover", text: "Include the documents, operating information and support contacts the facility will need after completion. If ongoing service is required, describe it in the enquiry so its availability and scope can be assessed separately." }
        ],
        faq: [
          { q: "Can a residential sauna be used in a commercial setting?", a: "Do not assume so. The intended application and the relevant manufacturer terms need to be confirmed for the exact configuration." },
          { q: "Can I submit a replacement-equipment enquiry?", a: "Yes. Include the existing equipment identification, photos, room information and the intended scope. Compatibility and the required work need to be assessed before a replacement is specified." }
        ],
        related: ["guide-commercial", "heaters", "installation", "quote"]
      },
      fr: {
        title: "Demandes de projets de sauna commercial | BestSauna.ca",
        description: "Préparez un projet de sauna pour l’hébergement, l’entraînement ou un espace partagé. Définissez l’usage, l’équipement et les travaux nécessaires.",
        eyebrow: "PROJETS COMMERCIAUX",
        heading: "Commencez par le fonctionnement de l’établissement.",
        intro: "Un projet de sauna commercial exige plus qu’une belle cabine. Définissez l’usage, les besoins d’exploitation et les responsabilités avant de choisir l’équipement.",
        image: "/images/commercial.webp",
        imageAlt: "Aménagement de sauna et de détente pour un projet d’hébergement",
        sections: [
          { title: "Présentez les besoins d’exploitation", text: "Précisez s’il s’agit d’un hébergement, d’un centre d’entraînement, d’un spa, d’un espace commun de copropriété ou d’un autre établissement. Ajoutez l’usage attendu, l’espace disponible, les heures d’ouverture et le type de projet : nouvelle construction ou remplacement." },
          { title: "Confirmez la compatibilité avec l’usage", text: "La configuration proposée doit être documentée pour l’application prévue. Les garanties, les commandes, l’assistance et les exigences d’installation doivent être examinées pour l’établissement, sans les déduire d’une fiche résidentielle.", bullets: ["Transmettez les plans, les dimensions et les renseignements sur l’équipement existant.", "Identifiez le responsable du projet et les personnes qui approuvent les choix techniques.", "Précisez les exigences d’approvisionnement, d’accès, d’échéancier et de documentation."] },
          { title: "Attribuez chaque partie des travaux", text: "La fourniture, la livraison, la préparation, l’assemblage et l’installation spécialisée peuvent faire intervenir différentes parties. La soumission doit préciser les responsabilités, les dépendances entre les travaux et la base de l’échéancier proposé." },
          { title: "Préparez la remise du projet", text: "Prévoyez les documents, les renseignements d’utilisation et les coordonnées d’assistance dont l’établissement aura besoin. Si un service continu est souhaité, décrivez-le pour que sa disponibilité et sa portée soient évaluées séparément." }
        ],
        faq: [
          { q: "Un sauna résidentiel peut-il servir dans un établissement commercial?", a: "Il ne faut pas le présumer. L’application prévue et les conditions du fabricant doivent être confirmées pour la configuration exacte." },
          { q: "Puis-je demander le remplacement d’un équipement?", a: "Oui. Ajoutez l’identification de l’équipement, des photos, les caractéristiques de la pièce et les travaux souhaités. La compatibilité et les interventions nécessaires doivent être évaluées avant de préciser le remplacement." }
        ],
        related: ["guide-commercial", "heaters", "installation", "quote"]
      }
    }
  },
  {
    key: "installation",
    paths: { en: "/en/delivery-installation/", fr: "/fr/livraison-installation/" },
    kind: "service",
    copy: {
      en: {
        title: "Sauna Delivery, Assembly & Installation Scope | BestSauna.ca",
        description: "Compare sauna supply and delivery, assembly and managed installation. Understand the inclusions and site work to request in your quotation.",
        eyebrow: "DELIVERY & INSTALLATION",
        heading: "Choose the help your project needs.",
        intro: "Equipment, delivery and installation are different parts of a sauna project. Choose a starting scope, then confirm the details for the product and your location.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Sauna interior showing timber construction and bench details",
        sections: [
          { title: "Three ways to scope the work", items: [
            { title: "Supply & delivery", text: "The specified equipment package and agreed delivery service. The quotation identifies the destination, unloading arrangements, package contents and documentation." },
            { title: "Supply, delivery & assembly", text: "Adds assembly of the contracted kit within confirmed service coverage. Placement and packaging removal are included only when expressly listed." },
            { title: "Managed installation project", text: "A project-specific proposal covering the agreed site work, delivery, handling, assembly and specialist responsibilities. Availability depends on the site, equipment and appointed partners." }
          ] },
          { title: "Know where one task ends and another begins", text: "A carrier’s delivery point may be different from the sauna’s final position. Base preparation, lifting, electrical connections and other specialist work should each have a named responsibility. Assembly completion alone does not mean all remaining installation work is complete.", bullets: ["Where will the shipment be unloaded, and who unloads it?", "Who moves it into position and prepares the base?", "Which connections, inspections and finishing tasks are included?"] },
          { title: "Confirm scope before scheduling", text: "Share access information and site photos early. Your written quotation should list included work, exclusions, site-readiness requirements and schedule dependencies. Any changed access conditions or added work should be agreed before that work proceeds." }
        ],
        faq: [
          { q: "Is installation available everywhere in Canada?", a: "Installation is confirmed for the specific location and scope. A national product enquiry does not establish local assembly or specialist availability." },
          { q: "Can I use my own contractor?", a: "You can request a supply-focused scope and identify work your contractor will handle. The responsibilities and installation requirements should be clear before ordering." }
        ],
        related: ["guide-delivery", "guide-budget", "coverage", "quote"]
      },
      fr: {
        title: "Livraison, assemblage et installation de sauna | BestSauna.ca",
        description: "Comparez la fourniture, la livraison, l’assemblage et la coordination d’installation. Précisez les inclusions et les travaux dans votre soumission.",
        eyebrow: "LIVRAISON ET INSTALLATION",
        heading: "Choisissez l’aide nécessaire à votre projet.",
        intro: "L’équipement, la livraison et l’installation sont des étapes distinctes. Choisissez une portée de départ, puis confirmez les détails selon le produit et l’emplacement.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Intérieur de sauna montrant la construction en bois et les banquettes",
        sections: [
          { title: "Trois façons de définir les travaux", items: [
            { title: "Fourniture et livraison", text: "L’équipement précisé et le service de livraison convenu. La soumission indique la destination, le déchargement, le contenu de l’ensemble et la documentation." },
            { title: "Fourniture, livraison et assemblage", text: "Ajoute l’assemblage de l’ensemble prévu dans une zone de service confirmée. La mise en place et le retrait des emballages sont inclus uniquement lorsqu’ils sont indiqués." },
            { title: "Projet d’installation coordonné", text: "Une proposition propre au projet précisant la préparation convenue, la livraison, la manutention, l’assemblage et les responsabilités spécialisées. L’offre dépend du terrain, de l’équipement et des partenaires retenus." }
          ] },
          { title: "Distinguez chaque étape", text: "Le point de livraison du transporteur peut être différent de l’emplacement final. La base, le levage, les raccordements et les autres travaux spécialisés doivent chacun avoir un responsable. La fin de l’assemblage ne signifie pas que toute l’installation est terminée.", bullets: ["Où l’envoi sera-t-il déchargé, et par qui?", "Qui le déplacera et préparera la base?", "Quels raccordements, inspections et travaux de finition sont inclus?"] },
          { title: "Confirmez la portée avant l’échéancier", text: "Transmettez les renseignements d’accès et des photos tôt dans le projet. La soumission écrite doit préciser les inclusions, les exclusions, la préparation nécessaire et les dépendances de l’échéancier. Les changements et ajouts doivent être convenus avant leur réalisation." }
        ],
        faq: [
          { q: "L’installation est-elle offerte partout au Canada?", a: "L’installation est confirmée selon l’emplacement et les travaux. Une demande de produit à l’échelle nationale ne confirme pas la disponibilité locale de l’assemblage ou des spécialistes." },
          { q: "Puis-je faire appel à mon entrepreneur?", a: "Vous pouvez demander la fourniture de l’équipement et préciser les travaux confiés à votre entrepreneur. Les responsabilités et exigences doivent être claires avant la commande." }
        ],
        related: ["guide-delivery", "guide-budget", "coverage", "quote"]
      }
    }
  },
  {
    key: "compare",
    paths: { en: "/en/compare-saunas/", fr: "/fr/comparer-les-saunas/" },
    kind: "compare",
    copy: {
      en: {
        title: "Compare Sauna Formats, Features & Project Scope | BestSauna.ca",
        description: "Compare sauna options on the same basis: usable space, package contents, installation needs, delivery and support. Build a more useful shortlist.",
        eyebrow: "COMPARE YOUR OPTIONS",
        heading: "Compare the complete project.",
        intro: "An attractive photograph or starting price cannot tell you everything. Compare the equipment, the space and the work required together.",
        image: "/images/outdoor.webp",
        imageAlt: "Outdoor sauna setting used to consider layout and placement",
        sections: [
          { title: "Choose the questions before the model", items: [
            { title: "Indoor or outdoor?", text: "Start with the proposed location and the exact product’s intended environment. Include access, preparation and the relationship to the surrounding space." },
            { title: "Cabin or barrel?", text: "Compare actual internal dimensions, bench layouts, entrances and exterior protection. The shape alone does not establish usable capacity or package quality." },
            { title: "Traditional or infrared?", text: "Compare the heating configuration, controls and documented requirements of each candidate. Choose on the basis of the experience and project you want, without relying on broad health claims." }
          ] },
          { title: "Use the same checklist for each option", bullets: ["Exact model, size and configuration.", "Interior layout and usable seating.", "Heater, controls and essential component inclusions.", "Base preparation, connections and assembly requirements.", "Delivered cost and onward placement responsibilities.", "Applicable warranty, documentation and support route."] },
          { title: "Make differences visible", text: "A quotation for an enclosure alone is not directly comparable with one that includes the heater and assembly. Put each offer into the same categories and identify the unpriced work before comparing totals. Where a detail is unresolved, ask for it in writing rather than treating it as included." }
        ],
        faq: [
          { q: "Can you help me compare two proposals?", a: "Include the equipment descriptions, inclusions and service scopes in your enquiry. Remove personal or payment information that is not needed for the comparison." },
          { q: "Is the lowest equipment price the lowest project cost?", a: "Not necessarily. Freight, site preparation, handling, assembly and required components can be separate. Compare the complete defined scope." }
        ],
        related: ["saunas", "guide-budget", "installation", "quote"]
      },
      fr: {
        title: "Comparer les formats et les projets de sauna | BestSauna.ca",
        description: "Comparez les saunas sur une même base : espace utilisable, inclusions, installation, livraison et assistance. Préparez une sélection utile.",
        eyebrow: "COMPARER LES OPTIONS",
        heading: "Comparez le projet complet.",
        intro: "Une belle photo ou un prix de départ ne dit pas tout. Comparez ensemble l’équipement, l’espace et les travaux nécessaires.",
        image: "/images/outdoor.webp",
        imageAlt: "Aménagement de sauna extérieur pour réfléchir à la disposition et à l’emplacement",
        sections: [
          { title: "Posez les questions avant de choisir le modèle", items: [
            { title: "Intérieur ou extérieur?", text: "Partez de l’emplacement envisagé et de l’environnement prévu pour le produit exact. Tenez compte de l’accès, de la préparation et de l’espace environnant." },
            { title: "Cabine ou tonneau?", text: "Comparez les dimensions intérieures, les banquettes, les entrées et la protection extérieure. La forme ne suffit pas à établir la capacité utilisable ou la qualité de l’ensemble." },
            { title: "Traditionnel ou infrarouge?", text: "Comparez le système de chauffage, les commandes et les exigences documentées. Choisissez selon l’expérience et le projet souhaités, sans vous fier à des promesses générales de santé." }
          ] },
          { title: "Utilisez la même liste pour chaque option", bullets: ["Modèle exact, dimensions et configuration.", "Aménagement intérieur et places assises utilisables.", "Chauffage, commandes et composants essentiels inclus.", "Préparation de la base, raccordements et assemblage.", "Coût livré et responsabilités de mise en place.", "Garantie applicable, documentation et assistance."] },
          { title: "Faites ressortir les différences", text: "Une soumission pour la cabine seule n’est pas directement comparable à une offre comprenant le chauffage et l’assemblage. Répartissez chaque offre dans les mêmes catégories et repérez les travaux non chiffrés avant de comparer les totaux. Demandez une confirmation écrite lorsqu’un détail reste incertain." }
        ],
        faq: [
          { q: "Pouvez-vous m’aider à comparer deux propositions?", a: "Ajoutez les descriptions d’équipement, les inclusions et les travaux prévus à votre demande. Retirez les renseignements personnels ou de paiement inutiles à la comparaison." },
          { q: "Le prix d’équipement le plus bas donne-t-il le projet le moins cher?", a: "Pas nécessairement. Le transport, la préparation, la manutention, l’assemblage et certains composants peuvent être séparés. Comparez la portée complète définie." }
        ],
        related: ["saunas", "guide-budget", "installation", "quote"]
      }
    }
  },
  {
    key: "heaters",
    paths: { en: "/en/heaters-accessories/", fr: "/fr/chauffe-saunas-accessoires/" },
    kind: "category",
    copy: {
      en: {
        title: "Sauna Heaters, Controls & Accessories Enquiries | BestSauna.ca",
        description: "Plan sauna heaters, controls and accessories as part of a documented configuration. Submit equipment details for a new project or replacement enquiry.",
        eyebrow: "HEATERS & ACCESSORIES",
        heading: "The right components belong in the plan.",
        intro: "A sauna package should make the equipment clear. Identify the heater, controls and necessary components before comparing quotations or arranging installation.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Close view of sauna materials and interior details",
        sections: [
          { title: "New project or replacement?", items: [
            { title: "New sauna configuration", text: "Confirm which heating equipment is specified for the enclosure and intended application. Ask for the relevant documents and an itemized list of required components." },
            { title: "Existing equipment enquiry", text: "Provide the manufacturer, model and available identification details, along with photos and a description of the request. Similar appearance does not establish compatibility." }
          ] },
          { title: "Look at the complete system", text: "Controls, sensors, stones and installation components should not be assumed to be included. For a wood-fired configuration, identify the exact equipment and related installation scope. Have sizing and compatibility assessed using the manufacturer’s requirements and the actual space.", bullets: ["State whether the sauna is residential, rental or commercial.", "Include room or enclosure dimensions and existing equipment details.", "Identify any component already selected or installed."] },
          { title: "Accessories with a clear purpose", text: "Ask about the practical items you want included, such as seating accessories or care items, rather than assuming a photographed accessory comes with the package. Availability and suitability should be confirmed with the equipment quotation. Specialist connection or repair work is a separate scope unless expressly included." }
        ],
        faq: [
          { q: "Can I choose a replacement heater by its rated output alone?", a: "That is not enough to establish compatibility. The exact equipment, room, controls and manufacturer requirements need to be reviewed together." },
          { q: "Does an equipment enquiry include repair or installation?", a: "No. Describe the work you need so product supply and any available specialist service can be assessed and quoted separately." }
        ],
        related: ["indoor", "commercial", "support", "quote"]
      },
      fr: {
        title: "Chauffe-saunas, commandes et accessoires | BestSauna.ca",
        description: "Prévoyez le chauffage, les commandes et les accessoires dans une configuration documentée. Décrivez votre projet ou votre besoin de remplacement.",
        eyebrow: "CHAUFFE-SAUNAS ET ACCESSOIRES",
        heading: "Prévoyez les bons composants dès le départ.",
        intro: "Un ensemble de sauna doit préciser son équipement. Identifiez le chauffage, les commandes et les composants nécessaires avant de comparer les soumissions ou de planifier les travaux.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Vue rapprochée des matériaux et des détails intérieurs d’un sauna",
        sections: [
          { title: "Nouveau projet ou remplacement?", items: [
            { title: "Nouvelle configuration", text: "Confirmez le système de chauffage prévu pour la cabine et l’application. Demandez les documents pertinents et une liste détaillée des composants nécessaires." },
            { title: "Équipement existant", text: "Fournissez le fabricant, le modèle et les renseignements d’identification disponibles, avec des photos et une description de la demande. Une apparence semblable ne confirme pas la compatibilité." }
          ] },
          { title: "Examinez le système complet", text: "Les commandes, les capteurs, les pierres et les composants d’installation ne sont pas nécessairement inclus. Pour une configuration au bois, précisez l’équipement exact et les travaux associés. Le dimensionnement et la compatibilité doivent être évalués selon le fabricant et l’espace réel.", bullets: ["Précisez l’usage résidentiel, locatif ou commercial du sauna.", "Ajoutez les dimensions de la pièce ou de la cabine et les détails de l’équipement existant.", "Identifiez les composants déjà choisis ou installés."] },
          { title: "Des accessoires choisis pour vos besoins", text: "Demandez les articles pratiques souhaités, comme des accessoires de banquette ou d’entretien, sans présumer que tout élément photographié est fourni. La disponibilité et la compatibilité sont confirmées avec la soumission. Les raccordements et réparations spécialisés demeurent distincts, sauf indication contraire." }
        ],
        faq: [
          { q: "Puis-je choisir un appareil de remplacement uniquement selon sa puissance?", a: "Ce renseignement ne suffit pas à établir la compatibilité. Il faut examiner ensemble l’appareil exact, la pièce, les commandes et les exigences du fabricant." },
          { q: "Une demande d’équipement comprend-elle la réparation ou l’installation?", a: "Non. Décrivez les travaux souhaités pour que la fourniture et les services spécialisés disponibles soient évalués et chiffrés séparément." }
        ],
        related: ["indoor", "commercial", "support", "quote"]
      }
    }
  },
  {
    key: "guides",
    paths: { en: "/en/guides/", fr: "/fr/guides/" },
    kind: "guide-index",
    copy: {
      en: {
        title: "Sauna Buying & Project Planning Guides | BestSauna.ca",
        description: "Practical guides to sauna budgets, delivery preparation and commercial project briefs. Prepare better questions and a clearer quotation request.",
        eyebrow: "PLANNING GUIDES",
        heading: "Get the important details into the plan.",
        intro: "Use these guides to define the project before choosing a final configuration. Each focuses on a decision that affects the quotation and the work involved.",
        image: "/images/cottage.webp",
        imageAlt: "Sauna setting beside a cottage in a natural landscape",
        sections: [
          { title: "Start with the question in front of you", items: [
            { title: "What belongs in the budget?", text: "Separate the sauna package from freight, handling, site preparation and installation. Learn what to ask before comparing quotation totals." },
            { title: "How will it reach the final location?", text: "Plan the route from the delivery vehicle to the prepared position, including access measurements, unloading and responsibilities." },
            { title: "What does a commercial brief need?", text: "Bring intended use, operating requirements, existing conditions and handover needs into the equipment discussion." }
          ] },
          { title: "Use a guide to improve your enquiry", text: "You do not need every answer at the beginning. A simple sketch, a few measurements and a clear description of the help you need are useful starting points. Flag anything that is still undecided so it can be addressed before a firm quotation." },
          { title: "Keep model-specific decisions with the model", text: "These guides explain the planning process. Exact dimensions, installation requirements, approved applications and equipment compatibility must come from the selected product’s documentation and the relevant site assessment. Keep those documents with the final scope so everyone works from the same configuration." }
        ],
        related: ["guide-budget", "guide-delivery", "guide-commercial", "quote"]
      },
      fr: {
        title: "Guides d’achat et de planification de sauna | BestSauna.ca",
        description: "Des guides pratiques sur le budget, la préparation de livraison et les projets commerciaux. Préparez vos questions et une demande plus précise.",
        eyebrow: "GUIDES DE PLANIFICATION",
        heading: "Intégrez les détails importants à votre projet.",
        intro: "Utilisez ces guides pour définir les besoins avant de retenir une configuration. Chacun porte sur une décision qui influence la soumission et les travaux à prévoir.",
        image: "/images/cottage.webp",
        imageAlt: "Aménagement de sauna près d’un chalet dans un paysage naturel",
        sections: [
          { title: "Commencez par votre question actuelle", items: [
            { title: "Que faut-il inclure dans le budget?", text: "Distinguez l’ensemble de sauna, le transport, la manutention, la préparation et l’installation. Repérez les questions à poser avant de comparer les totaux." },
            { title: "Comment l’équipement atteindra-t-il sa destination?", text: "Préparez le trajet entre le camion et l’emplacement final, y compris les mesures d’accès, le déchargement et les responsabilités." },
            { title: "Que doit contenir un projet commercial?", text: "Intégrez l’usage, les besoins d’exploitation, l’état des lieux et la remise du projet à la discussion sur l’équipement." }
          ] },
          { title: "Préparez une demande plus utile", text: "Vous n’avez pas besoin de toutes les réponses dès le départ. Un croquis, quelques mesures et une description de l’accompagnement souhaité constituent un bon point de départ. Signalez les choix encore ouverts afin de les régler avant une soumission ferme." },
          { title: "Rattachez les choix techniques au modèle précis", text: "Ces guides expliquent la planification. Les dimensions, les exigences d’installation, les usages autorisés et la compatibilité doivent provenir de la documentation du produit choisi et de l’évaluation de l’emplacement. Conservez ces documents avec la portée finale pour que tous travaillent à partir de la même configuration." }
        ],
        related: ["guide-budget", "guide-delivery", "guide-commercial", "quote"]
      }
    }
  },
  {
    key: "coverage",
    paths: { en: "/en/areas/", fr: "/fr/regions-desservies/" },
    kind: "coverage",
    copy: {
      en: {
        title: "Canadian Sauna Project Enquiries & Delivery Coverage | BestSauna.ca",
        description: "Submit a sauna project enquiry from anywhere in Canada. Product delivery and installation availability are assessed for the destination and scope.",
        eyebrow: "CANADIAN PROJECT ENQUIRIES",
        heading: "Start with your location.",
        intro: "Share your city and postal code. Supply options, delivery arrangements and installation services are confirmed for the equipment and the actual destination.",
        image: "/images/cottage.webp",
        imageAlt: "Sauna project setting in a Canadian-style woodland landscape",
        sections: [
          { title: "Enquiries across Canada", text: "You can submit a project in any province or territory: British Columbia, Alberta, Saskatchewan, Manitoba, Ontario, Québec, New Brunswick, Nova Scotia, Prince Edward Island, Newfoundland and Labrador, Yukon, the Northwest Territories or Nunavut. Your address helps determine which options can be assessed." },
          { title: "Delivery and installation are separate", text: "A product delivery arrangement does not automatically include a local assembly crew or specialist contractor. Each part of the service needs to be confirmed. The quotation should identify the delivery point, onward handling and any installation work agreed for that location." },
          { title: "Tell us about access early", bullets: ["Urban property: gates, narrow access, parking and the distance to the final position.", "Cottage or rural property: road access, seasonal restrictions and receiving arrangements.", "Remote destination: additional transport stages, transfers and the available unloading point.", "Commercial facility: delivery windows, loading access, internal routes and contractor requirements."] },
          { title: "A clear answer for your address", text: "Include the proposed sauna type and service level in the enquiry. That provides a better starting point than a city name alone. Final availability, delivered cost and site-dependent work are established in the written project scope." }
        ],
        faq: [
          { q: "Does this page mean every service is offered in every location?", a: "No. It provides a national enquiry route. Specific supply, delivery, assembly and specialist services are confirmed individually for the project." }
        ],
        related: ["installation", "guide-delivery", "quote"]
      },
      fr: {
        title: "Demandes de projets au Canada et livraison | BestSauna.ca",
        description: "Présentez un projet de sauna partout au Canada. La livraison et les services d’installation sont évalués selon la destination et les travaux.",
        eyebrow: "PROJETS AU CANADA",
        heading: "Commençons par votre emplacement.",
        intro: "Indiquez votre ville et votre code postal. Les options de fourniture, la livraison et les services d’installation sont confirmés selon l’équipement et la destination.",
        image: "/images/cottage.webp",
        imageAlt: "Aménagement de sauna dans un paysage boisé d’inspiration canadienne",
        sections: [
          { title: "Des demandes de partout au Canada", text: "Vous pouvez soumettre un projet dans une province ou un territoire : Colombie-Britannique, Alberta, Saskatchewan, Manitoba, Ontario, Québec, Nouveau-Brunswick, Nouvelle-Écosse, Île-du-Prince-Édouard, Terre-Neuve-et-Labrador, Yukon, Territoires du Nord-Ouest ou Nunavut. L’adresse permet d’évaluer les options pertinentes." },
          { title: "Livraison et installation sont distinctes", text: "Une livraison de produit ne comprend pas automatiquement une équipe locale d’assemblage ou un entrepreneur spécialisé. Chaque service doit être confirmé. La soumission précise le point de livraison, la manutention supplémentaire et les travaux convenus à cet endroit." },
          { title: "Décrivez l’accès dès le départ", bullets: ["Propriété urbaine : portail, passage étroit, stationnement et distance jusqu’à l’emplacement final.", "Chalet ou propriété rurale : accès routier, restrictions saisonnières et réception de l’envoi.", "Destination éloignée : étapes de transport, transferts et point de déchargement disponible.", "Établissement commercial : plages de livraison, débarcadère, parcours intérieur et exigences des entrepreneurs."] },
          { title: "Une réponse pour votre adresse", text: "Ajoutez le type de sauna et l’accompagnement souhaité à votre demande. Cela donne un meilleur point de départ que la ville seule. La disponibilité, le coût livré et les travaux liés au terrain sont établis dans la portée écrite du projet." }
        ],
        faq: [
          { q: "Tous les services sont-ils offerts à chaque endroit indiqué?", a: "Non. Cette page permet de présenter une demande à l’échelle nationale. La fourniture, la livraison, l’assemblage et les services spécialisés sont confirmés individuellement pour le projet." }
        ],
        related: ["installation", "guide-delivery", "quote"]
      }
    }
  },
  {
    key: "support",
    paths: { en: "/en/support/", fr: "/fr/soutien/" },
    kind: "support",
    copy: {
      en: {
        title: "Sauna Enquiry, Order & Product Support | BestSauna.ca",
        description: "Prepare a clear support request for an enquiry, delivery or equipment question. Include the reference and relevant product details.",
        eyebrow: "SUPPORT",
        heading: "Keep the next step clear.",
        intro: "Whether your question concerns a project enquiry, a delivery or equipment documentation, a few specific details help identify the right next step.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Sauna bench and interior construction details",
        sections: [
          { title: "Include the information that identifies the request", bullets: ["Your name and the email used for the enquiry or order.", "The enquiry reference or order details, if available.", "The product manufacturer, model and relevant identification details.", "A short description of the question and useful photos, if requested.", "The property location when the question involves delivery or site work."] },
          { title: "Separate product questions from project work", text: "A product warranty enquiry, an assembly issue and a request for additional work may have different responsibilities. Describe what happened and which part of the project is involved. The applicable equipment documents and agreed work scope provide the starting point." },
          { title: "Delivery questions", text: "For a damaged or incomplete shipment, keep the delivery paperwork and record the visible issue. Share the item and shipment details through the relevant support route. The claim process and any applicable reporting requirements depend on the actual order and carrier arrangements." },
          { title: "Documents and additional assistance", text: "Ask for the manual, configuration details or support contact connected with your equipment. If you need replacement components or on-site work, describe the request so compatibility and service availability can be assessed. Support contact does not automatically establish warranty coverage or an included service visit." }
        ],
        faq: [
          { q: "What if I only have an enquiry reference?", a: "Include that reference and the email you used. Explain what you would like to clarify or change about the project request." }
        ],
        related: ["heaters", "installation", "quote", "privacy"]
      },
      fr: {
        title: "Assistance pour les demandes, commandes et produits | BestSauna.ca",
        description: "Préparez une demande d’assistance claire concernant un projet, une livraison ou l’équipement. Ajoutez votre référence et les détails pertinents.",
        eyebrow: "ASSISTANCE",
        heading: "Clarifiez la prochaine étape.",
        intro: "Pour une question sur un projet, une livraison ou la documentation d’un équipement, quelques renseignements précis aident à déterminer la suite.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Détails d’une banquette et de la construction intérieure d’un sauna",
        sections: [
          { title: "Ajoutez les renseignements qui identifient la demande", bullets: ["Votre nom et le courriel utilisé pour la demande ou la commande.", "La référence de demande ou les détails de commande disponibles.", "Le fabricant, le modèle et les renseignements d’identification pertinents.", "Une brève description de la question et des photos utiles, si elles sont demandées.", "L’emplacement de la propriété pour les questions de livraison ou de travaux."] },
          { title: "Distinguez le produit des travaux", text: "Une demande de garantie, un problème d’assemblage et des travaux supplémentaires peuvent relever de responsabilités différentes. Décrivez la situation et la partie du projet concernée. La documentation de l’équipement et la portée convenue servent de point de départ." },
          { title: "Questions de livraison", text: "Pour un envoi endommagé ou incomplet, conservez les documents de livraison et notez le problème visible. Transmettez les détails de l’article et de l’envoi par le canal d’assistance pertinent. La procédure et les exigences de signalement dépendent de la commande et du transporteur." },
          { title: "Documentation et aide supplémentaire", text: "Demandez le manuel, les détails de configuration ou les coordonnées d’assistance associés à l’équipement. Pour des pièces ou une intervention sur place, décrivez le besoin afin d’évaluer la compatibilité et la disponibilité du service. Une demande d’assistance ne confirme pas automatiquement une garantie ou une visite incluse." }
        ],
        faq: [
          { q: "Que faire si je possède seulement une référence de demande?", a: "Ajoutez cette référence et le courriel utilisé. Expliquez ce que vous souhaitez préciser ou modifier dans votre demande de projet." }
        ],
        related: ["heaters", "installation", "quote", "privacy"]
      }
    }
  },
  {
    key: "quote",
    paths: { en: "/en/request-a-quote/", fr: "/fr/demande-de-soumission/" },
    kind: "quote",
    copy: {
      en: {
        title: "Request a Sauna Project Quote | BestSauna.ca",
        description: "Tell BestSauna.ca about your location, preferred sauna and service needs. Start a residential, cottage or commercial project enquiry.",
        eyebrow: "START YOUR PROJECT",
        heading: "Tell us what you have in mind.",
        intro: "Share the space, the sauna you are considering and the help you need. You can start an enquiry even if you have not chosen a model.",
        image: "/images/outdoor.webp",
        imageAlt: "Outdoor sauna setting for a residential project",
        sections: [
          { title: "A useful first brief", text: "Include your city and postal code, whether the sauna is for a home, cottage or commercial property, and whether it will be indoors or outdoors. Tell us the service scope you prefer and any timing that matters to the project." },
          { title: "Not sure yet? That is a valid starting point.", text: "Explain the available space and what you want help deciding. You can indicate a seating preference, design priority or budget without selecting a manufacturer. Mark unknown details as undecided rather than guessing.", bullets: ["Describe the location and intended use.", "Choose supply, assembly or a managed project enquiry.", "Mention known access restrictions or existing site work.", "Provide contact details so the project can be discussed."] },
          { title: "After you submit", text: "When the website successfully records your request, it displays an enquiry reference. Keep that reference for follow-up. Submission is a project enquiry, not an order confirmation, product reservation or promise of availability. The equipment configuration and any delivery or installation scope are confirmed through the quotation process." },
          { title: "Keep the first request focused", text: "Payment-card details and sensitive personal information are not needed. Detailed plans, photographs and full site information can be requested later where they are useful to assess the project." }
        ],
        related: ["installation", "compare", "privacy"]
      },
      fr: {
        title: "Demander une soumission pour un sauna | BestSauna.ca",
        description: "Décrivez l’emplacement, le sauna envisagé et les services souhaités. Présentez un projet pour la maison, le chalet ou un établissement commercial.",
        eyebrow: "COMMENCER VOTRE PROJET",
        heading: "Parlez-nous de votre projet.",
        intro: "Décrivez l’espace, le type de sauna et l’accompagnement souhaité. Vous pouvez présenter une demande même sans avoir choisi de modèle.",
        image: "/images/outdoor.webp",
        imageAlt: "Aménagement de sauna extérieur pour un projet résidentiel",
        sections: [
          { title: "Un premier portrait utile", text: "Indiquez la ville et le code postal, l’usage résidentiel, au chalet ou commercial, ainsi que l’emplacement intérieur ou extérieur. Précisez l’accompagnement souhaité et les dates importantes pour le projet." },
          { title: "Vous hésitez encore? C’est un bon point de départ.", text: "Décrivez l’espace disponible et les choix pour lesquels vous souhaitez de l’aide. Vous pouvez préciser les places assises, le style ou le budget sans choisir de fabricant. Indiquez les éléments à déterminer plutôt que de les deviner.", bullets: ["Décrivez l’emplacement et l’usage prévu.", "Choisissez une demande de fourniture, d’assemblage ou de projet coordonné.", "Mentionnez les contraintes d’accès et les travaux existants.", "Ajoutez vos coordonnées pour permettre un échange sur le projet."] },
          { title: "Après l’envoi", text: "Lorsque le site enregistre votre demande, il affiche une référence. Conservez-la pour le suivi. La demande n’est ni une confirmation de commande, ni une réservation de produit, ni une garantie de disponibilité. La configuration et la portée de livraison ou d’installation sont confirmées dans le processus de soumission." },
          { title: "Gardez la première demande ciblée", text: "Les renseignements de carte de paiement et les données personnelles sensibles ne sont pas nécessaires. Des plans, des photos et des détails supplémentaires pourront être demandés s’ils aident à évaluer le projet." }
        ],
        related: ["installation", "compare", "privacy"]
      }
    }
  },
  {
    key: "about",
    paths: { en: "/en/about/", fr: "/fr/a-propos/" },
    kind: "about",
    copy: {
      en: {
        title: "About BestSauna.ca | Sauna Equipment & Project Planning",
        description: "BestSauna.ca focuses on clear sauna choices, defined project scopes and useful quotations for homes, cottages and commercial spaces.",
        eyebrow: "ABOUT BESTSAUNA.CA",
        heading: "A clearer way to plan your sauna.",
        intro: "BestSauna.ca brings the equipment decision and the practical project questions into the same conversation, for homes, cottages and commercial spaces.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Natural timber and carefully arranged sauna seating",
        sections: [
          { title: "Begin with the right questions", text: "Where will the sauna go? How will it reach that position? What belongs in the equipment package, and which work do you want help coordinating? Those answers are more useful than a long list of models with unclear inclusions." },
          { title: "Keep the scope understandable", text: "The approach is to separate supply, delivery, assembly and specialist installation so the proposed work is easy to review. Product suitability, location and the required partners shape the final quotation. A service description should tell you what it includes and what still needs arranging." },
          { title: "Make room for different projects", text: "A private backyard, a cottage property and a shared commercial facility need different briefs. BestSauna.ca provides a place to explore those options and submit the information needed to assess a suitable project scope." },
          { title: "Keep the details accountable", text: "Specific equipment needs specific documentation. Package contents, delivery arrangements, support responsibilities and intended-use requirements should be established in writing. The same principle applies to installation: availability and scope are confirmed for the actual address, not assumed from a national website." }
        ],
        related: ["saunas", "installation", "commercial", "quote"]
      },
      fr: {
        title: "À propos de BestSauna.ca | Équipement et projets de sauna",
        description: "BestSauna.ca privilégie des choix clairs, des travaux bien définis et des soumissions utiles pour la maison, le chalet et les espaces commerciaux.",
        eyebrow: "À PROPOS DE BESTSAUNA.CA",
        heading: "Une façon plus claire de préparer votre sauna.",
        intro: "BestSauna.ca réunit le choix de l’équipement et les questions pratiques du projet dans une même démarche, pour la maison, le chalet et les espaces commerciaux.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Bois naturel et banquettes soigneusement disposées dans un sauna",
        sections: [
          { title: "Commencez par les bonnes questions", text: "Où ira le sauna? Comment atteindra-t-il cet endroit? Que comprend l’équipement, et quels travaux souhaitez-vous faire coordonner? Ces réponses sont plus utiles qu’une longue liste de modèles aux inclusions imprécises." },
          { title: "Gardez une portée compréhensible", text: "La démarche distingue la fourniture, la livraison, l’assemblage et l’installation spécialisée pour faciliter l’examen de la proposition. Le produit, l’emplacement et les partenaires nécessaires déterminent la soumission finale. Chaque service doit préciser ses inclusions et les éléments qui restent à organiser." },
          { title: "Tenez compte des différents projets", text: "Une cour privée, un chalet et un établissement partagé demandent des préparatifs différents. BestSauna.ca permet d’explorer les options et de transmettre les renseignements nécessaires à l’évaluation d’un projet adapté." },
          { title: "Appuyez les détails sur des documents", text: "Un équipement précis exige une documentation précise. Le contenu de l’ensemble, la livraison, les responsabilités d’assistance et l’usage prévu doivent être établis par écrit. Le même principe s’applique à l’installation : sa disponibilité et sa portée sont confirmées pour l’adresse réelle, sans les présumer à partir d’un site national." }
        ],
        related: ["saunas", "installation", "commercial", "quote"]
      }
    }
  },
  {
    key: "privacy",
    paths: { en: "/en/privacy/", fr: "/fr/confidentialite/" },
    kind: "policy",
    copy: {
      en: {
        title: "Privacy & Project Enquiry Information | BestSauna.ca",
        description: "How BestSauna.ca uses project enquiry information, where website submissions are stored and how to contact us about your information.",
        eyebrow: "PRIVACY",
        heading: "Your project information.",
        intro: "This notice explains how information submitted through the BestSauna.ca project enquiry form is handled. Send only the details needed to describe and discuss your project.",
        image: "",
        imageAlt: "",
        sections: [
          { title: "Information you provide", text: "An enquiry can include your name, email, telephone number, city or postal code, preferred contact method and project details. Your choices may describe the intended use, sauna type, service needs and timing. Do not include payment-card details or sensitive personal information in the message." },
          { title: "Why it is used", text: "The information is used to assess the request, understand the project, respond to you and manage related correspondence. Your enquiry reference helps associate follow-up with the submitted request. Sending an enquiry does not subscribe you to automatic marketing, and enquiry information is not sold." },
          { title: "Storage and processing", text: "Website form submissions are stored in the website database hosted by Cloudflare. Service providers may support the hosting, processing and handling needed for the enquiry. Relevant project information may be needed by parties assisting with an assessment or proposed work; it should be limited to the purpose involved." },
          { title: "Questions and requests", text: "Contact info@bestsauna.ca to ask about information connected with your enquiry, request a correction or ask for deletion. Include your enquiry reference where available, without adding unnecessary sensitive information. Further details may be needed to identify the relevant record and respond appropriately." }
        ],
        related: ["quote", "support", "terms"]
      },
      fr: {
        title: "Confidentialité et renseignements de projet | BestSauna.ca",
        description: "Comment BestSauna.ca utilise les renseignements de demande, où ils sont conservés et comment nous joindre à leur sujet.",
        eyebrow: "CONFIDENTIALITÉ",
        heading: "Les renseignements de votre projet.",
        intro: "Cet avis explique le traitement des renseignements transmis dans le formulaire de projet de BestSauna.ca. Envoyez seulement les détails nécessaires pour décrire votre projet et en discuter.",
        image: "",
        imageAlt: "",
        sections: [
          { title: "Les renseignements transmis", text: "Une demande peut comprendre votre nom, votre courriel, votre téléphone, votre ville ou code postal, le moyen de communication souhaité et les détails du projet. Vos choix peuvent préciser l’usage, le type de sauna, les services et l’échéancier. N’ajoutez pas de données de carte de paiement ou de renseignements personnels sensibles." },
          { title: "Leur utilisation", text: "Ces renseignements servent à évaluer la demande, à comprendre le projet, à vous répondre et à gérer les échanges connexes. La référence permet de relier le suivi à votre demande. L’envoi d’une demande ne vous abonne pas automatiquement à des communications promotionnelles et les renseignements ne sont pas vendus." },
          { title: "Conservation et traitement", text: "Les demandes du formulaire sont conservées dans la base de données du site hébergée par Cloudflare. Des fournisseurs peuvent contribuer à l’hébergement, au traitement et à la gestion de la demande. Des renseignements pertinents peuvent être nécessaires aux parties qui aident à évaluer le projet ou les travaux proposés; ils doivent être limités à cette fin." },
          { title: "Questions et demandes", text: "Écrivez à info@bestsauna.ca pour poser une question sur les renseignements liés à votre demande, les faire corriger ou demander leur suppression. Ajoutez la référence si vous l’avez, sans renseignements sensibles inutiles. Des précisions peuvent être nécessaires pour repérer le dossier et répondre adéquatement." }
        ],
        related: ["quote", "support", "terms"]
      }
    }
  },
  {
    key: "terms",
    paths: { en: "/en/terms/", fr: "/fr/conditions/" },
    kind: "policy",
    copy: {
      en: {
        title: "Website & Project Enquiry Terms | BestSauna.ca",
        description: "Understand the role of website information, project enquiries and written quotations when planning a sauna with BestSauna.ca.",
        eyebrow: "WEBSITE & ENQUIRY TERMS",
        heading: "From an enquiry to an agreed scope.",
        intro: "The website helps you explore sauna options and prepare a project request. A submitted enquiry is the start of a discussion, not an equipment order or installation agreement.",
        image: "",
        imageAlt: "",
        sections: [
          { title: "Planning information", text: "Category descriptions, guides and setting images help explain project options. They do not establish the availability, exact specification or suitability of a particular product. Use the selected model’s documentation and the relevant site assessment for installation decisions." },
          { title: "Quotations and availability", text: "A written quotation identifies the proposed equipment, configuration, price basis and included services. Product availability, delivery arrangements and site-dependent work need to be confirmed for the project. A form reference acknowledges a recorded enquiry; it does not reserve stock or confirm a delivery date." },
          { title: "Scope and responsibilities", text: "Supply, freight, unloading, onward placement, assembly, base preparation and specialist connections are distinct tasks. Included work and customer-arranged work should be identified before an order or service commitment. Changes to the site, configuration or requested work need to be reviewed against the agreed scope." },
          { title: "Order-specific terms", text: "Payment requirements, cancellations, returns, product warranties and workmanship responsibilities depend on the actual equipment and agreement. Request the applicable written terms before accepting a quotation. General website wording does not replace those order-specific documents or establish a maintenance contract." },
          { title: "Contact", text: "For a question about a project request or the information on this website, contact info@bestsauna.ca and include the relevant page or enquiry reference." }
        ],
        related: ["installation", "quote", "privacy"]
      },
      fr: {
        title: "Conditions du site et des demandes de projet | BestSauna.ca",
        description: "Comprenez le rôle du site, des demandes de projet et des soumissions écrites pour préparer un sauna avec BestSauna.ca.",
        eyebrow: "CONDITIONS DU SITE ET DES DEMANDES",
        heading: "D’une demande à une portée convenue.",
        intro: "Le site vous aide à explorer les options de sauna et à préparer une demande. Un formulaire envoyé amorce un échange; il ne constitue pas une commande ni une entente d’installation.",
        image: "",
        imageAlt: "",
        sections: [
          { title: "Renseignements de planification", text: "Les catégories, les guides et les images d’ambiance expliquent des options de projet. Ils ne confirment pas la disponibilité, les caractéristiques exactes ou la compatibilité d’un produit. Les décisions d’installation reposent sur la documentation du modèle choisi et l’évaluation de l’emplacement." },
          { title: "Soumissions et disponibilité", text: "Une soumission écrite précise l’équipement, la configuration, la base du prix et les services proposés. La disponibilité, la livraison et les travaux propres au site doivent être confirmés. Une référence de formulaire confirme l’enregistrement d’une demande, pas une réservation de stock ou une date de livraison." },
          { title: "Portée et responsabilités", text: "La fourniture, le transport, le déchargement, la mise en place, l’assemblage, la base et les raccordements spécialisés sont distincts. Les travaux inclus et ceux organisés par le client doivent être précisés avant un engagement. Tout changement de site, de configuration ou de travaux doit être examiné selon la portée convenue." },
          { title: "Conditions propres à la commande", text: "Le paiement, l’annulation, les retours, les garanties de produit et les responsabilités de travaux dépendent de l’équipement et de l’entente. Demandez les conditions écrites applicables avant d’accepter une soumission. Le texte général du site ne remplace pas ces documents et ne crée pas de contrat d’entretien." },
          { title: "Nous joindre", text: "Pour une question sur un projet ou le contenu du site, écrivez à info@bestsauna.ca en indiquant la page ou la référence de demande pertinente." }
        ],
        related: ["installation", "quote", "privacy"]
      }
    }
  },
  {
    key: "guide-budget",
    paths: { en: "/en/guides/sauna-project-cost/", fr: "/fr/guides/budget-projet-sauna/" },
    kind: "guide",
    copy: {
      en: {
        title: "What Belongs in a Complete Sauna Project Budget? | BestSauna.ca",
        description: "Build a sauna budget that separates equipment, delivery, handling, base preparation and installation. Compare quotations with the same scope.",
        eyebrow: "GUIDE · PROJECT BUDGET",
        heading: "Budget for the complete sauna project.",
        intro: "The useful question is not only what the sauna costs. It is what you need to spend to receive the agreed equipment, place it at your property and complete the work included in your project.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Sauna interior details to consider when defining an equipment package",
        sections: [
          { title: "1. Define the configuration first", text: "Start with the exact enclosure, size, layout and heating arrangement. Record the components included in the offer and anything required separately. A photograph may show accessories, glazing or an entrance configuration that is not part of the quoted package. Ask for a written equipment list and the relevant model documents. Without that common starting point, two prices may describe substantially different projects." },
          { title: "2. Separate the main cost lines", items: [
            { title: "Sauna and equipment", text: "The enclosure, benches, specified heater, controls and essential components. Confirm the actual inclusions and any selected options rather than assuming a complete package." },
            { title: "Delivery", text: "The agreed transport service to the defined destination. Ask about unloading, appointments, transfers and any destination-specific conditions that affect the quoted service." },
            { title: "Handling and placement", text: "The movement from the delivery point to the final location, including any separately required lifting or handling arrangement." },
            { title: "Site preparation", text: "The base and other work needed to make the proposed position ready for the selected sauna. Keep customer-arranged construction visible in the overall budget." },
            { title: "Assembly and specialist work", text: "Kit assembly, equipment connections and any other agreed installation tasks. Identify which party prices and performs each part." },
            { title: "Finishing and agreed extras", text: "Items such as packaging removal, surrounding finishes or additional accessories, where requested. Clarify the treatment of applicable taxes in the final comparison." }
          ] },
          { title: "3. Compare quotations on the same basis", text: "Put each offer against the same equipment and service list. Mark every line included, excluded or unresolved. An equipment-only offer should not be compared directly with a supply-and-assembly proposal. If an item is excluded, obtain the separate estimate needed for your total project budget. If it is unresolved, ask for clarification before treating the quoted total as final." },
          { title: "4. Address the site variables early", text: "A narrow route, an unfinished base or an additional transport stage can change the scope. Provide location details, measurements and photos before accepting a handling or installation price. If site assessment is needed, establish what it covers and whether it has a separate charge. Do not assume the person quoting the product has already assessed every part of the property." },
          { title: "5. Check the written terms alongside the total", text: "Review the configuration, quotation validity, timing basis, payment milestones and responsibilities for changed work. Ask for the applicable cancellation, return and warranty terms before acceptance. Keep the final scope and the supporting documents together. A lower total is useful only when it still covers the equipment and work you intend to buy." },
          { title: "A useful next step", text: "Prepare one short brief with the location, proposed sauna type, available space and preferred service package. Identify work you will arrange yourself. This helps turn a general budget conversation into a quotation that can be assessed line by line." }
        ],
        faq: [
          { q: "Why is there no universal installed price?", a: "The equipment configuration, destination, handling and site work need to be defined. A meaningful price relates to that scope rather than an unspecified national average." },
          { q: "What if I do not yet know the full budget?", a: "State your priorities and the work you expect to handle separately. You can ask which decisions must be resolved before a firm quotation is possible." }
        ],
        related: ["compare", "installation", "guide-delivery", "quote"]
      },
      fr: {
        title: "Que comprend le budget complet d’un projet de sauna? | BestSauna.ca",
        description: "Préparez un budget qui distingue l’équipement, la livraison, la manutention, la base et l’installation. Comparez les offres sur une même portée.",
        eyebrow: "GUIDE · BUDGET DU PROJET",
        heading: "Prévoyez le budget du projet complet.",
        intro: "La question utile dépasse le prix du sauna. Il faut prévoir les dépenses pour recevoir l’équipement convenu, le placer à votre propriété et réaliser les travaux compris dans votre projet.",
        image: "/images/sauna-detail.webp",
        imageAlt: "Détails intérieurs d’un sauna à examiner pour définir l’ensemble d’équipement",
        sections: [
          { title: "1. Définissez d’abord la configuration", text: "Commencez par la cabine exacte, les dimensions, l’aménagement et le chauffage. Notez les composants inclus dans l’offre et les éléments à prévoir séparément. Une photo peut montrer des accessoires, du vitrage ou une entrée qui ne font pas partie du prix. Demandez une liste écrite et la documentation du modèle. Sans cette base commune, deux prix peuvent correspondre à des projets très différents." },
          { title: "2. Distinguez les principaux postes", items: [
            { title: "Sauna et équipement", text: "La cabine, les banquettes, le chauffage précisé, les commandes et les composants essentiels. Confirmez les inclusions et les options choisies au lieu de présumer que tout est fourni." },
            { title: "Livraison", text: "Le transport convenu jusqu’à une destination définie. Vérifiez le déchargement, les rendez-vous, les transferts et les conditions propres à la destination." },
            { title: "Manutention et mise en place", text: "Le déplacement entre le point de livraison et l’emplacement final, y compris tout levage ou service de manutention à prévoir séparément." },
            { title: "Préparation de l’emplacement", text: "La base et les autres travaux nécessaires pour accueillir le sauna choisi. Les travaux de construction organisés par le client doivent rester visibles dans le budget global." },
            { title: "Assemblage et travaux spécialisés", text: "L’assemblage, les raccordements et les autres interventions convenues. Identifiez la partie qui chiffre et réalise chaque étape." },
            { title: "Finition et ajouts convenus", text: "Le retrait des emballages, les finis environnants ou les accessoires demandés. Précisez le traitement des taxes applicables dans la comparaison finale." }
          ] },
          { title: "3. Comparez les soumissions sur une même base", text: "Examinez chaque offre avec la même liste d’équipement et de services. Indiquez pour chaque poste s’il est inclus, exclu ou à préciser. Une offre d’équipement seul ne se compare pas directement à une proposition avec assemblage. Pour un poste exclu, obtenez l’estimation distincte nécessaire au budget total. Pour un poste incertain, demandez une clarification avant de considérer le total comme définitif." },
          { title: "4. Réglez tôt les variables du terrain", text: "Un passage étroit, une base inachevée ou une étape de transport supplémentaire peuvent modifier les travaux. Transmettez l’emplacement, des mesures et des photos avant d’accepter un prix de manutention ou d’installation. Si une évaluation est nécessaire, précisez sa portée et son coût éventuel. Ne présumez pas que la personne qui chiffre le produit a déjà examiné toute la propriété." },
          { title: "5. Examinez les conditions avec le prix", text: "Vérifiez la configuration, la validité de la soumission, la base de l’échéancier, les paiements et le traitement des changements. Demandez les conditions d’annulation, de retour et de garantie avant l’acceptation. Conservez la portée finale et les documents ensemble. Un total inférieur est utile seulement s’il couvre encore l’équipement et les travaux souhaités." },
          { title: "Une prochaine étape utile", text: "Préparez une courte description de l’emplacement, du type de sauna, de l’espace disponible et de l’accompagnement souhaité. Identifiez les travaux que vous organiserez. Vous pourrez ainsi passer d’une discussion générale à une soumission examinable poste par poste." }
        ],
        faq: [
          { q: "Pourquoi ne pas afficher un prix installé universel?", a: "La configuration, la destination, la manutention et les travaux doivent être définis. Un prix utile correspond à cette portée plutôt qu’à une moyenne nationale non précisée." },
          { q: "Et si je ne connais pas encore mon budget complet?", a: "Présentez vos priorités et les travaux que vous prévoyez organiser. Demandez quels choix doivent être réglés pour obtenir une soumission ferme." }
        ],
        related: ["compare", "installation", "guide-delivery", "quote"]
      }
    }
  },
  {
    key: "guide-delivery",
    paths: { en: "/en/guides/sauna-delivery-site-preparation/", fr: "/fr/guides/livraison-preparation-sauna/" },
    kind: "guide",
    copy: {
      en: {
        title: "Sauna Delivery & Site Preparation Guide | BestSauna.ca",
        description: "Plan the route from delivery to final placement. Clarify unloading, access, base preparation, assembly and responsibilities before your sauna arrives.",
        eyebrow: "GUIDE · DELIVERY & SITE READINESS",
        heading: "Plan the whole route, not just the address.",
        intro: "A delivery address tells the carrier where to go. A useful site plan also explains where the shipment will be unloaded, how it reaches its final position and who is responsible for each stage.",
        image: "/images/outdoor.webp",
        imageAlt: "Outdoor sauna positioned within a landscaped property",
        sections: [
          { title: "1. Understand what is arriving", text: "Ask whether the sauna arrives as a kit, separate components or another agreed format. Obtain the relevant package dimensions and handling information for that configuration. These details affect the route and equipment needed. Do not infer the delivery format from a photograph of the finished sauna. Keep the supplier’s shipment information with the installation brief so the receiving person and contractor plan around the same delivery." },
          { title: "2. Identify the actual unloading point", text: "Clarify where the delivery vehicle can stop, whether unloading is included and what must be available on arrival. Confirm who will receive the shipment and how any appointment is arranged. A driveway delivery, a terminal pickup and final backyard placement are different services. If another transport stage is required, specify who arranges it and where responsibility transfers between the agreed tasks." },
          { title: "3. Measure the route to the final position", text: "Walk the complete route and record the narrowest points, turns, stairs, slopes and changes in surface. Include gates and doors that will be used, not just the open space around the destination. Photos help explain the route, but dimensions still matter. Where access is uncertain, ask for the appropriate assessment before committing to a handling plan or assuming the kit can be carried through." },
          { title: "4. Prepare the site for the selected model", text: "The base and surrounding preparation should follow the product’s requirements and the assessment of the actual location. Establish who completes that work and how readiness will be confirmed. If the sauna is part of a renovation, coordinate access and preparation with the other contractors. A delivery booking should not conceal an unfinished dependency that prevents placement or assembly." },
          { title: "5. Coordinate the remaining installation tasks", text: "Put assembly, specialist connections, any necessary inspection responsibilities and finishing work into a clear sequence. Identify which contractor owns each task. Confirm whether packaging removal is included and what the handover will contain. The sauna may be assembled before every connection or other required task is finished; the completion record should make any remaining work explicit." },
          { title: "6. Keep a useful delivery record", text: "Have the relevant order and delivery information available when the shipment arrives. Record the visible condition and any missing or damaged items, then follow the applicable order and carrier process. Keep photos and paperwork with the project documents. If the site or access changes before delivery, tell the parties involved early enough to reassess the agreed handling and installation arrangements." },
          { title: "What to send with the enquiry", bullets: ["City, postal code and property type.", "Proposed sauna location and rough dimensions.", "Photos or a sketch showing the route from the unloading point.", "Known gates, stairs, slopes or restricted delivery times.", "Work already completed and tasks you plan to arrange separately."] }
        ],
        faq: [
          { q: "Does a clear driveway mean the site is ready?", a: "It answers only part of the question. The unloading arrangement, onward route, prepared position and remaining installation work also need to be considered." },
          { q: "When should access restrictions be mentioned?", a: "At the first enquiry if you know them, and again if conditions change. They can affect the service scope and should be resolved before scheduling." }
        ],
        related: ["installation", "coverage", "cottage", "quote"]
      },
      fr: {
        title: "Guide de livraison et de préparation d’un sauna | BestSauna.ca",
        description: "Préparez le trajet jusqu’à la mise en place. Clarifiez le déchargement, l’accès, la base, l’assemblage et les responsabilités avant la livraison.",
        eyebrow: "GUIDE · LIVRAISON ET PRÉPARATION",
        heading: "Prévoyez tout le trajet, pas seulement l’adresse.",
        intro: "L’adresse indique au transporteur où aller. Un plan utile précise aussi le point de déchargement, le déplacement jusqu’à l’emplacement final et le responsable de chaque étape.",
        image: "/images/outdoor.webp",
        imageAlt: "Sauna extérieur installé dans l’aménagement d’une propriété",
        sections: [
          { title: "1. Comprenez ce qui sera livré", text: "Demandez si le sauna arrive en ensemble à assembler, en composants séparés ou sous une autre forme convenue. Obtenez les dimensions des colis et les renseignements de manutention. Ils déterminent le trajet et les moyens nécessaires. Ne déduisez pas le format de livraison d’une photo du sauna terminé. Conservez les détails d’expédition avec le projet pour que la personne qui reçoit l’envoi et l’entrepreneur préparent la même livraison." },
          { title: "2. Identifiez le vrai point de déchargement", text: "Précisez où le camion peut s’arrêter, si le déchargement est inclus et ce qui doit être disponible à l’arrivée. Déterminez qui reçoit l’envoi et comment le rendez-vous est organisé. Une livraison dans l’entrée, une cueillette au terminal et la mise en place dans la cour sont des services différents. Pour une étape de transport supplémentaire, indiquez qui l’organise et comment les responsabilités se répartissent." },
          { title: "3. Mesurez le trajet jusqu’à la destination", text: "Parcourez le trajet complet et notez les passages étroits, les virages, les escaliers, les pentes et les changements de surface. Mesurez les portails et les portes réellement utilisés, pas seulement l’espace autour du sauna. Les photos expliquent le parcours, mais les dimensions restent nécessaires. Si l’accès est incertain, demandez l’évaluation appropriée avant de retenir un plan de manutention ou de présumer que les composants passent." },
          { title: "4. Préparez l’emplacement pour le modèle choisi", text: "La base et la préparation doivent respecter les exigences du produit et l’évaluation du lieu. Déterminez qui réalise les travaux et comment l’état de préparation sera confirmé. Dans une rénovation, coordonnez l’accès avec les autres entrepreneurs. Une réservation de livraison ne doit pas masquer un travail inachevé qui empêcherait la mise en place ou l’assemblage." },
          { title: "5. Coordonnez les tâches restantes", text: "Placez l’assemblage, les raccordements spécialisés, les responsabilités d’inspection et la finition dans un ordre clair. Identifiez le responsable de chaque tâche. Confirmez le retrait des emballages et les éléments remis à la fin. La cabine peut être assemblée avant la fin des raccordements ou d’autres interventions nécessaires; le compte rendu doit préciser ce qui reste à faire." },
          { title: "6. Conservez un dossier de livraison utile", text: "Gardez les renseignements de commande et de livraison accessibles à l’arrivée. Notez l’état visible et les articles manquants ou endommagés, puis suivez la procédure applicable à la commande et au transporteur. Conservez les photos et documents. Si l’emplacement ou l’accès change, prévenez les parties assez tôt pour réévaluer la manutention et les travaux convenus." },
          { title: "Renseignements à joindre à la demande", bullets: ["Ville, code postal et type de propriété.", "Emplacement prévu du sauna et dimensions approximatives.", "Photos ou croquis du trajet depuis le point de déchargement.", "Portails, escaliers, pentes ou horaires de livraison restreints.", "Travaux déjà réalisés et tâches que vous organiserez séparément."] }
        ],
        faq: [
          { q: "Une entrée dégagée signifie-t-elle que tout est prêt?", a: "Cela répond à une seule partie de la question. Il faut aussi examiner le déchargement, le trajet, l’emplacement préparé et les travaux restants." },
          { q: "Quand faut-il signaler les contraintes d’accès?", a: "Dès la première demande si vous les connaissez, puis à chaque changement. Elles peuvent modifier la portée et doivent être réglées avant l’échéancier." }
        ],
        related: ["installation", "coverage", "cottage", "quote"]
      }
    }
  },
  {
    key: "guide-commercial",
    paths: { en: "/en/guides/commercial-sauna-project-brief/", fr: "/fr/guides/preparer-projet-sauna-commercial/" },
    kind: "guide",
    copy: {
      en: {
        title: "How to Prepare a Commercial Sauna Project Brief | BestSauna.ca",
        description: "Define operating needs, existing conditions, equipment suitability and contractor responsibilities for a commercial sauna enquiry.",
        eyebrow: "GUIDE · COMMERCIAL PLANNING",
        heading: "Write a brief the project team can work from.",
        intro: "A useful commercial brief connects the facility’s operating needs with the equipment and work being requested. It helps suppliers, project managers and contractors assess the same project rather than fill in different assumptions.",
        image: "/images/commercial.webp",
        imageAlt: "Sauna and relaxation area illustrating a hospitality project setting",
        sections: [
          { title: "1. Describe the intended operation", text: "State the facility type, who will use the sauna and the proposed operating pattern. Include expected operating hours, the desired user capacity and how access will be managed. A guest accommodation project, fitness facility and shared residential amenity may need different assessments. Explain whether the project is a new installation, a renovation or a replacement so the equipment discussion starts with the actual application." },
          { title: "2. Document the existing conditions", text: "Provide dimensions, plans and useful photos. For an existing sauna, include equipment identification and the reason for the proposed change. Identify known constraints such as limited access, occupied premises, work windows or finishes to be retained. Clearly distinguish measured information from estimates. If parts of the site have not been assessed, list those questions instead of allowing them to become assumed facts in the quotation." },
          { title: "3. Set the equipment requirements", text: "Describe the required configuration and the functions that matter to the operator. Ask for documentation supporting the proposed product’s intended use, installation requirements and applicable warranty. Review controls, support and parts arrangements for the specific application. Do not assume that a residential package or warranty carries over to commercial or guest use simply because the enclosure fits the available room." },
          { title: "4. Divide supply and installation responsibilities", text: "List the work expected from each party: equipment supply, delivery, unloading, movement through the property, base or room preparation, assembly, specialist connections and finishing. Identify responsibility for relevant applications, inspections and documentation rather than leaving them as an unnamed project task. State which contractors the facility will retain directly and which services it is asking BestSauna.ca to assess within a coordinated scope." },
          { title: "5. Define the commercial decision process", text: "Name the project contact, technical reviewers and purchasing decision-maker. Include any tender format, quotation deadline, purchase-order procedure or site-access requirements. Separate the desired completion date from fixed constraints and explain dependencies on other work. Ask suppliers to identify the basis of their timing estimates. A clear approval route helps keep product decisions and scope changes connected to the people responsible for them." },
          { title: "6. Plan the handover and support", text: "Specify the documents, equipment identification, operating information and contacts the facility needs at completion. If training, maintenance or ongoing service is requested, define the intended scope so availability can be assessed; do not treat it as automatically included in equipment supply. Establish how incomplete work and outstanding documents will be recorded. Keep the agreed configuration and responsibilities with the facility’s project records." },
          { title: "A concise enquiry package", bullets: ["Facility and intended use.", "Location, plans, dimensions and current equipment details.", "Proposed configuration and documented requirements.", "Requested supply and installation responsibilities.", "Project contacts, approval process and timing constraints.", "Handover and any separately requested service needs."] }
        ],
        faq: [
          { q: "Should the budget come before the technical brief?", a: "Share both where possible. A budget gives context, but the intended use and scope are needed to judge whether a proposed configuration answers the facility’s requirements." },
          { q: "Can the project begin with incomplete plans?", a: "An initial enquiry can identify the missing inputs. Make those gaps explicit so a preliminary discussion is not mistaken for a complete specification or firm installation commitment." }
        ],
        related: ["commercial", "installation", "heaters", "quote"]
      },
      fr: {
        title: "Préparer un projet de sauna commercial | BestSauna.ca",
        description: "Définissez l’exploitation, l’état des lieux, la compatibilité de l’équipement et les responsabilités pour une demande de sauna commercial.",
        eyebrow: "GUIDE · PROJET COMMERCIAL",
        heading: "Préparez une description utile à toute l’équipe.",
        intro: "Un bon dossier relie les besoins d’exploitation à l’équipement et aux travaux demandés. Il permet aux fournisseurs, aux gestionnaires et aux entrepreneurs d’évaluer le même projet plutôt que de partir d’hypothèses différentes.",
        image: "/images/commercial.webp",
        imageAlt: "Espace de sauna et de détente illustrant un projet d’hébergement",
        sections: [
          { title: "1. Décrivez l’exploitation prévue", text: "Précisez le type d’établissement, les utilisateurs et le fonctionnement envisagé. Ajoutez les heures d’ouverture, la capacité souhaitée et la gestion de l’accès. Un hébergement, un centre d’entraînement et un espace commun résidentiel peuvent demander des évaluations différentes. Indiquez s’il s’agit d’une nouvelle installation, d’une rénovation ou d’un remplacement pour que le choix d’équipement parte de l’application réelle." },
          { title: "2. Documentez l’état des lieux", text: "Fournissez les dimensions, les plans et des photos utiles. Pour un sauna existant, ajoutez l’identification des appareils et la raison du changement. Signalez les contraintes : accès limité, locaux occupés, horaires de travaux ou finis à conserver. Distinguez les mesures des estimations. Si certains éléments n’ont pas été évalués, nommez les questions au lieu de les laisser devenir des faits présumés dans la soumission." },
          { title: "3. Définissez les exigences d’équipement", text: "Décrivez la configuration et les fonctions importantes pour l’exploitant. Demandez les documents sur l’usage prévu, l’installation et la garantie applicable. Examinez les commandes, l’assistance et les pièces selon cette application. Ne présumez pas qu’un ensemble ou une garantie résidentielle couvre un usage commercial ou locatif simplement parce que la cabine entre dans la pièce." },
          { title: "4. Répartissez la fourniture et les travaux", text: "Énumérez les tâches de chaque partie : équipement, transport, déchargement, déplacement dans la propriété, préparation de la base ou de la pièce, assemblage, raccordements et finition. Attribuez les demandes, inspections et documents pertinents à un responsable. Précisez les entrepreneurs engagés directement par l’établissement et les services que vous demandez à BestSauna.ca d’évaluer dans une portée coordonnée." },
          { title: "5. Définissez le processus de décision", text: "Identifiez le contact du projet, les responsables techniques et la personne qui approuve l’achat. Ajoutez les formats d’appel d’offres, délais de soumission, procédures de commande et exigences d’accès. Distinguez la date souhaitée des contraintes fixes et des travaux préalables. Demandez sur quoi reposent les échéanciers proposés. Un parcours d’approbation clair relie les choix de produits et les changements aux responsables concernés." },
          { title: "6. Prévoyez la remise et l’assistance", text: "Précisez les documents, les identifiants d’équipement, les renseignements d’utilisation et les contacts requis à la fin. Si une formation, un entretien ou un service continu est souhaité, définissez-le pour en évaluer la disponibilité; il n’est pas automatiquement compris dans la fourniture. Déterminez comment noter les travaux inachevés et les documents manquants. Conservez la configuration et les responsabilités convenues au dossier de l’établissement." },
          { title: "Un dossier de demande concis", bullets: ["Établissement et usage prévu.", "Emplacement, plans, dimensions et équipement existant.", "Configuration proposée et exigences documentées.", "Responsabilités de fourniture et d’installation demandées.", "Contacts, approbation et contraintes d’échéancier.", "Remise du projet et services demandés séparément."] }
        ],
        faq: [
          { q: "Faut-il fixer le budget avant de rédiger le dossier technique?", a: "Présentez les deux si possible. Le budget donne un contexte, mais l’usage et les travaux sont nécessaires pour déterminer si la configuration répond aux besoins de l’établissement." },
          { q: "Peut-on commencer avec des plans incomplets?", a: "Une première demande permet de repérer les renseignements manquants. Précisez ces lacunes pour ne pas confondre une discussion préliminaire avec une spécification complète ou un engagement ferme d’installation." }
        ],
        related: ["commercial", "installation", "heaters", "quote"]
      }
    }
  }
];

export function pagePath(key: string, lang: Lang): string {
  const page = pages.find((entry) => entry.key === key);
  if (!page) throw new Error("Unknown BestSauna page key: " + key);
  return page.paths[lang];
}
