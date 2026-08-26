import { CompanyInfo, MaterialItem, Client, BTPDocument } from '../types';

export const INITIAL_COMPANY: CompanyInfo = {
  name: "BATI-PLUS CONSTRUCTIONS & TRAVAUX",
  activity: "Entreprise Générale de Bâtiment, Gros Œuvre, Rénovation & Matériaux",
  slogan: "L'art de bâtir en toute solidité",
  logoUrl: "",
  logoPreset: "crane", // 'crane' | 'building' | 'hammer' | 'brick' | 'paint' | 'ruler'
  address: "14 Boulevard des Artisans, Zone Industrielle Nord",
  city: "Abidjan / Paris",
  country: "Côte d'Ivoire / France",
  phone: "+225 07 48 92 10 33",
  phoneSecondary: "+33 6 12 34 56 78",
  email: "contact@batiplus-construction.com",
  website: "www.batiplus-construction.com",
  siret: "849 201 938 00012",
  rccm: "CI-ABJ-2023-B-14902",
  tvaNumber: "FR82849201938",
  defaultTaxRate: 18, // 18% standard or 20%
  currency: "FCFA",
  currencyPosition: "after",
  bankName: "Banque Atlantique / Société Générale",
  iban: "CI93 CI00 2019 3800 0012 3456 7890",
  bic: "BATICIAB",
  mobileMoney: "Orange Money / Wave : +225 07 48 92 10 33",
  defaultValidityDays: 30,
  defaultAdvancePercentage: 40,
  legalNotice: "Assurance Décennale et Responsabilité Civile Professionnelle souscrites auprès de AXA Assurances. TVA non applicable, art. 293 B du CGI ou TVA en vigueur.",
  paymentTerms: "Modalités : 40% d'acompte à la commande, 40% à l'avancement des travaux, 20% solde à la réception du chantier."
};

export const INITIAL_MATERIALS: MaterialItem[] = [
  // Gros Œuvre & Maçonnerie
  {
    id: "mat-1",
    category: "gros_oeuvre",
    name: "Ciment CPJ 42.5 (Haute Résistance)",
    description: "Ciment gris haute performance pour fondations, dalles, poteaux et chaînages",
    unit: "sac (50kg)",
    defaultPrice: 4800,
    defaultTaxRate: 18
  },
  {
    id: "mat-2",
    category: "gros_oeuvre",
    name: "Sable de rivière criblé (Gros)",
    description: "Sable propre débarrassé de limon pour béton armé et gros œuvre",
    unit: "m³",
    defaultPrice: 18000,
    defaultTaxRate: 18
  },
  {
    id: "mat-3",
    category: "gros_oeuvre",
    name: "Sable fin de lagune (Enduit)",
    description: "Sable fin lavé idéal pour crépissage, finitions et lissage des murs",
    unit: "m³",
    defaultPrice: 16000,
    defaultTaxRate: 18
  },
  {
    id: "mat-4",
    category: "gros_oeuvre",
    name: "Gravier concassé 15/25",
    description: "Granulats concassés pour formulation de béton armé",
    unit: "m³",
    defaultPrice: 22000,
    defaultTaxRate: 18
  },
  {
    id: "mat-5",
    category: "maconnerie",
    name: "Parpaing creux aggloméré 15x20x50",
    description: "Bloc de béton standard pour murs extérieurs et élévations",
    unit: "pièce",
    defaultPrice: 380,
    defaultTaxRate: 18
  },
  {
    id: "mat-6",
    category: "maconnerie",
    name: "Parpaing plein ou semi-plein 20x20x50",
    description: "Pour soubassements, murs de clôture et charges lourdes",
    unit: "pièce",
    defaultPrice: 550,
    defaultTaxRate: 18
  },
  {
    id: "mat-7",
    category: "maconnerie",
    name: "Hourdis béton 16cm pour plancher",
    description: "Entrevous de plancher nervuré pour dalle d'étage",
    unit: "pièce",
    defaultPrice: 650,
    defaultTaxRate: 18
  },

  // Armatures & Ferraillage
  {
    id: "mat-8",
    category: "quincaillerie_fer",
    name: "Fer à béton Haute Adhérence HA 12",
    description: "Barre d'acier 12m pour poteaux, semelles et poutres maîtresses",
    unit: "barre (12m)",
    defaultPrice: 6200,
    defaultTaxRate: 18
  },
  {
    id: "mat-9",
    category: "quincaillerie_fer",
    name: "Fer à béton Haute Adhérence HA 10",
    description: "Barre d'acier 12m pour ferraillage raidisseurs et linteaux",
    unit: "barre (12m)",
    defaultPrice: 4400,
    defaultTaxRate: 18
  },
  {
    id: "mat-10",
    category: "quincaillerie_fer",
    name: "Fer à béton Haute Adhérence HA 8",
    description: "Barre d'acier 12m pour cadres, étriers et chaînages",
    unit: "barre (12m)",
    defaultPrice: 2800,
    defaultTaxRate: 18
  },
  {
    id: "mat-11",
    category: "quincaillerie_fer",
    name: "Fil de ligature recuit (Bobine 5kg)",
    description: "Fil noir malléable pour attache des armatures en ferraille",
    unit: "rouleau",
    defaultPrice: 7500,
    defaultTaxRate: 18
  },

  // Bois & Coffrage
  {
    id: "mat-12",
    category: "gros_oeuvre",
    name: "Planches de coffrage bois blanc 4m",
    description: "Planches de résineux épaisseur 27mm pour coffrage poteaux et poutres",
    unit: "pièce",
    defaultPrice: 3500,
    defaultTaxRate: 18
  },
  {
    id: "mat-13",
    category: "gros_oeuvre",
    name: "Chevrons sapin 6x8cm (longueur 4m)",
    description: "Chevrons pour étaiement, calage et charpente secondaire",
    unit: "pièce",
    defaultPrice: 4200,
    defaultTaxRate: 18
  },
  {
    id: "mat-14",
    category: "charpente_couverture",
    name: "Tôle Bac Alu 50/100e (Feuille 6 mètres)",
    description: "Tôle profilée ondulée aluminium pour toiture industrielle ou résidentielle",
    unit: "feuille (6m)",
    defaultPrice: 18500,
    defaultTaxRate: 18
  },

  // Plomberie & Sanitaires
  {
    id: "mat-15",
    category: "plomberie_sanitaire",
    name: "Tube PVC Évacuation Ø100 (Barre 4m)",
    description: "Tuyau rigide PVC pour évacuation eaux usées et vannes",
    unit: "barre (4m)",
    defaultPrice: 8500,
    defaultTaxRate: 18
  },
  {
    id: "mat-16",
    category: "plomberie_sanitaire",
    name: "Tube PVC Pression Ø32 (Barre 4m)",
    description: "Tuyau alimentation eau sous pression",
    unit: "barre (4m)",
    defaultPrice: 3200,
    defaultTaxRate: 18
  },
  {
    id: "mat-17",
    category: "plomberie_sanitaire",
    name: "Pack WC suspendu avec bâti-support complet",
    description: "Cuvette sans bride, mécanisme silencieux double touche",
    unit: "pièce",
    defaultPrice: 145000,
    defaultTaxRate: 18
  },

  // Électricité
  {
    id: "mat-18",
    category: "electricite",
    name: "Câble cuivre 3G2.5mm² (Couronne 100m)",
    description: "Câble d'alimentation pour prises de courant de force et électroménager",
    unit: "couronne (100m)",
    defaultPrice: 38000,
    defaultTaxRate: 18
  },
  {
    id: "mat-19",
    category: "electricite",
    name: "Gaine ICTA annelée Ø20 avec tire-fil (100m)",
    description: "Conduit flexible isolant pour encastrement câbles dans les murs",
    unit: "couronne (100m)",
    defaultPrice: 16500,
    defaultTaxRate: 18
  },
  {
    id: "mat-20",
    category: "electricite",
    name: "Coffret tableau électrique 24 modules précâblé",
    description: "Avec disjoncteurs différentiels 30mA et divisionnaires",
    unit: "pièce",
    defaultPrice: 65000,
    defaultTaxRate: 18
  },

  // Peinture & Carrelage
  {
    id: "mat-21",
    category: "peinture_revetement",
    name: "Peinture acrylique blanche lavable (Seau 15L)",
    description: "Peinture mate haute opacité grand pouvoir couvrant murs et plafonds",
    unit: "pot (15L)",
    defaultPrice: 28000,
    defaultTaxRate: 18
  },
  {
    id: "mat-22",
    category: "carrelage",
    name: "Carrelage Grès cérame émaillé 60x60cm",
    description: "Carreaux sol intérieur grand passage, finition satinée anti-tache",
    unit: "m²",
    defaultPrice: 9500,
    defaultTaxRate: 18
  },
  {
    id: "mat-23",
    category: "carrelage",
    name: "Colle carrelage haute adhérence C2E (Sac 25kg)",
    description: "Mortier-colle amélioré pour intérieur et extérieur grand format",
    unit: "sac (25kg)",
    defaultPrice: 6200,
    defaultTaxRate: 18
  },

  // Main d'œuvre & Prestations
  {
    id: "mat-24",
    category: "main_oeuvre",
    name: "Main d'œuvre Chef Maçon qualifié",
    description: "Direction technique, alignement, montage de murs, coffrage et coulage",
    unit: "jour",
    defaultPrice: 15000,
    defaultTaxRate: 0
  },
  {
    id: "mat-25",
    category: "main_oeuvre",
    name: "Main d'œuvre Aide-maçon / Manœuvre",
    description: "Préparation mortier, manutention matériaux, gâchage et approvisionnement",
    unit: "jour",
    defaultPrice: 7000,
    defaultTaxRate: 0
  },
  {
    id: "mat-26",
    category: "main_oeuvre",
    name: "Pose et fourniture carrelage au m²",
    description: "Ragréage, encollage double, pose des carreaux, découpes et joints fins",
    unit: "m²",
    defaultPrice: 4500,
    defaultTaxRate: 18
  },
  {
    id: "mat-27",
    category: "engins_location",
    name: "Location Bétonnière thermique 350L (avec carburant)",
    description: "Malaxage continu pour dalles et coulage de béton sur chantier",
    unit: "jour",
    defaultPrice: 20000,
    defaultTaxRate: 18
  },
  {
    id: "mat-28",
    category: "engins_location",
    name: "Camion Benne 10m³ - Transport & déchargement",
    description: "Livraison directe sur site avec chauffeur et déchargement sécurisé",
    unit: "voyage",
    defaultPrice: 35000,
    defaultTaxRate: 18
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "cli-1",
    name: "M. Kouassi Jean-Marc",
    company: "Résidence Les Palmiers",
    phone: "+225 05 12 34 56 78",
    email: "jeanmarc.kouassi@email.com",
    address: "Cocody Riviera Golf, Villa 12B, Abidjan",
    siteAddress: "Chantier Villa R+1, Lot 45, Bingerville Palmeraie",
    notes: "Chantier de surélévation et clôture de sécurité. Accès camion facile.",
    createdAt: "2026-08-10T10:00:00Z"
  },
  {
    id: "cli-2",
    name: "Mme Claire Dubois",
    company: "SCI Horizon BTP",
    phone: "+33 6 88 99 00 11",
    email: "claire.dubois@scihorizon.fr",
    address: "28 Rue de la République, 69002 Lyon",
    siteAddress: "Rénovation Immeuble Pierre, 14 Avenue Jean Jaurès, 69007 Lyon",
    notes: "Rénovation plomberie et sanitaires 4 appartements.",
    createdAt: "2026-08-15T14:30:00Z"
  },
  {
    id: "cli-3",
    name: "Ing. Amadou Traoré",
    company: "Groupe Immobilier Sahel",
    phone: "+225 01 02 03 04 05",
    email: "a.traore@sahel-immo.ci",
    address: "Plateau Immeuble CCIA, 8e étage",
    siteAddress: "Entrepôt Logistique Zone Portuaire, San Pedro",
    notes: "Dallage industriel et charpente métallique.",
    createdAt: "2026-08-20T09:15:00Z"
  }
];

export const INITIAL_DOCUMENTS: BTPDocument[] = [
  {
    id: "doc-1",
    type: "quote",
    docNumber: "DEV-2026-0042",
    title: "Travaux de Maçonnerie, Clôture et Fourniture Matériaux",
    date: "2026-08-24",
    validityDate: "2026-09-24",
    clientId: "cli-1",
    client: INITIAL_CLIENTS[0],
    siteLocation: "Chantier Villa R+1, Lot 45, Bingerville Palmeraie",
    items: [
      {
        id: "item-sec-1",
        type: "section",
        title: "I. FOURNITURE MATÉRIAUX & GROS ŒUVRE",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        discountPercent: 0,
        totalHT: 0
      },
      {
        id: "item-1",
        type: "item",
        title: "Ciment CPJ 42.5 (Haute Résistance)",
        description: "Pour coulage des semelles filantes, poteaux d'angles et chaînage",
        category: "gros_oeuvre",
        unit: "sac (50kg)",
        quantity: 80,
        unitPrice: 4800,
        taxRate: 18,
        discountPercent: 0,
        totalHT: 384000
      },
      {
        id: "item-2",
        type: "item",
        title: "Sable de rivière criblé (Gros)",
        description: "Pour confection du béton armé dosé à 350 kg/m³",
        category: "gros_oeuvre",
        unit: "m³",
        quantity: 12,
        unitPrice: 18000,
        taxRate: 18,
        discountPercent: 0,
        totalHT: 216000
      },
      {
        id: "item-3",
        type: "item",
        title: "Gravier concassé 15/25",
        description: "Granulats pour béton de structure",
        category: "gros_oeuvre",
        unit: "m³",
        quantity: 15,
        unitPrice: 22000,
        taxRate: 18,
        discountPercent: 0,
        totalHT: 330000
      },
      {
        id: "item-4",
        type: "item",
        title: "Parpaing creux aggloméré 15x20x50",
        description: "Pour élévation du mur de clôture hauteur 2.40m sur 40 ml",
        category: "maconnerie",
        unit: "pièce",
        quantity: 800,
        unitPrice: 380,
        taxRate: 18,
        discountPercent: 5,
        totalHT: 288800
      },
      {
        id: "item-5",
        type: "item",
        title: "Fer à béton Haute Adhérence HA 10",
        description: "Pour armatures chaînages horizontaux et verticaux",
        category: "quincaillerie_fer",
        unit: "barre (12m)",
        quantity: 40,
        unitPrice: 4400,
        taxRate: 18,
        discountPercent: 0,
        totalHT: 176000
      },
      {
        id: "item-sec-2",
        type: "section",
        title: "II. MAIN D'ŒUVRE & EXÉCUTION",
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        discountPercent: 0,
        totalHT: 0
      },
      {
        id: "item-6",
        type: "item",
        title: "Main d'œuvre Chef Maçon qualifié",
        description: "Implantation, fouilles, ferraillage, coulage et élévation clôture",
        category: "main_oeuvre",
        unit: "jour",
        quantity: 14,
        unitPrice: 15000,
        taxRate: 0,
        discountPercent: 0,
        totalHT: 210000
      },
      {
        id: "item-7",
        type: "item",
        title: "Main d'œuvre Aide-maçon / Manœuvre",
        description: "Gâchage, transport parpaings, approvisionnement mortier",
        category: "main_oeuvre",
        unit: "jour",
        quantity: 28,
        unitPrice: 7000,
        taxRate: 0,
        discountPercent: 0,
        totalHT: 196000
      },
      {
        id: "item-8",
        type: "item",
        title: "Location Bétonnière thermique 350L",
        description: "Mise à disposition avec carburant pendant les phases de coulage",
        category: "engins_location",
        unit: "jour",
        quantity: 5,
        unitPrice: 20000,
        taxRate: 18,
        discountPercent: 0,
        totalHT: 100000
      }
    ],
    globalDiscountPercent: 0,
    totalHT: 1900800,
    totalDiscount: 15200,
    totalTax: 269064,
    totalTTC: 2169864,
    advancePercent: 40,
    advanceAmount: 867946,
    amountPaid: 0,
    balanceDue: 2169864,
    status: "sent",
    notes: "Travaux planifiés sur une durée estimée de 15 jours ouvrés à compter de la réception de l'acompte. Eau et électricité de chantier fournies par le maître d'ouvrage.",
    paymentTerms: "40% à la validation du devis pour achat des matériaux, 40% à l'élévation des murs, 20% solde après coulage des chaperons et réception.",
    createdAt: "2026-08-24T08:30:00Z",
    updatedAt: "2026-08-24T08:30:00Z",
    syncStatus: "synced"
  },
  {
    id: "doc-2",
    type: "invoice",
    docNumber: "FAC-2026-0018",
    title: "Facture d'Acompte - Fourniture Matériaux & Réfection Toiture",
    date: "2026-08-18",
    validityDate: "2026-09-05",
    clientId: "cli-2",
    client: INITIAL_CLIENTS[1],
    siteLocation: "Rénovation Immeuble Pierre, 14 Avenue Jean Jaurès, Lyon",
    items: [
      {
        id: "item-inv-1",
        type: "item",
        title: "Tôle Bac Alu 50/100e (Feuille 6 mètres)",
        description: "Fourniture pour remplacement couverture toiture bâtiment principal",
        category: "charpente_couverture",
        unit: "feuille (6m)",
        quantity: 25,
        unitPrice: 18500,
        taxRate: 20,
        discountPercent: 0,
        totalHT: 462500
      },
      {
        id: "item-inv-2",
        type: "item",
        title: "Chevrons sapin 6x8cm (longueur 4m)",
        description: "Remplacement pannes et chevrons endommagés",
        category: "gros_oeuvre",
        unit: "pièce",
        quantity: 30,
        unitPrice: 4200,
        taxRate: 20,
        discountPercent: 0,
        totalHT: 126000
      },
      {
        id: "item-inv-3",
        type: "item",
        title: "Main d'œuvre Pose et Fixation Couverture",
        description: "Dépose ancienne toiture, renfort charpente et fixation tôles étanches",
        category: "main_oeuvre",
        unit: "forfait",
        quantity: 1,
        unitPrice: 250000,
        taxRate: 20,
        discountPercent: 0,
        totalHT: 250000
      }
    ],
    globalDiscountPercent: 0,
    totalHT: 838500,
    totalDiscount: 0,
    totalTax: 167700,
    totalTTC: 1006200,
    advancePercent: 50,
    advanceAmount: 503100,
    amountPaid: 503100,
    balanceDue: 503100,
    status: "partial",
    notes: "Facture d'acompte réglée par virement bancaire. Solde exigible à la livraison définitive.",
    paymentTerms: "Solde payable à 30 jours date de facture.",
    createdAt: "2026-08-18T11:00:00Z",
    updatedAt: "2026-08-19T14:20:00Z",
    syncStatus: "synced"
  }
];
