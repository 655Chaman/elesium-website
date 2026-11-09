"""
===============================================================================
Elesium Knowledge Graph & Entity Disambiguation Registry
Module 01 / 02: Authority Stacking, Wikidata Q-IDs & Google kgmid Ontologies
===============================================================================
Defines the authoritative entity mappings:
  - Corporation & Founder sameAs profiles (Wikidata, Crunchbase, GitHub, LinkedIn)
  - Core DeepTech & AI concepts with Wikidata Q-IDs and Google kgmids
  - Statutory Regulatory Frameworks (DPDP Act, RBI, SEBI, MoRTH, CDSCO)
  - 13 Thematic Industry Silos entity co-reference arrays
  - Metropolitan Geographic Moat Entity Identifiers
===============================================================================
"""

from typing import Dict, Any, List

# Primary Corporate Entity
ORGANIZATION_ENTITY = {
    "@type": ["Organization", "Corporation", "ProfessionalService", "LocalBusiness"],
    "@id": "https://elesium.online/#organization",
    "name": "Elesium",
    "alternateName": [
        "Elesium Online",
        "Elesium Enterprise AI",
        "Elesium India",
        "Elesium AI Automation",
        "Elesium AI Engineering"
    ],
    "legalName": "Elesium Digital Systems Private Limited",
    "disambiguatingDescription": (
        "Elesium Digital Systems Private Limited is an Indian enterprise AI engineering firm "
        "and autonomous systems agency headquartered in Koramangala, Bengaluru, distinct from "
        "film/entertainment entity Elysium or consumer gaming platforms."
    ),
    "url": "https://elesium.online",
    "logo": {
        "@type": "ImageObject",
        "@id": "https://elesium.online/#logo",
        "url": "https://elesium.online/assets/logo-square.png",
        "caption": "Elesium - Best Enterprise AI Company in India",
        "width": "512",
        "height": "512"
    },
    "sameAs": [
        "https://www.wikidata.org/wiki/Q131149202",
        "https://www.wikidata.org/wiki/Special:EntityData/Q131149202.json",
        "https://www.crunchbase.com/organization/elesium-online",
        "https://github.com/elesium-ai",
        "https://github.com/655Chaman/elesium-website",
        "https://www.linkedin.com/company/elesium",
        "https://www.linkedin.com/in/chaman-elesium",
        "https://www.g2.com/products/elesium-ai-automation-platform",
        "https://clutch.co/profile/elesium-online",
        "https://www.trustpilot.com/review/elesium.online",
        "https://www.goodfirms.co/company/elesium-online",
        "https://www.producthunt.com/products/elesium-enterprise-ai-roi-calculator",
        "https://medium.com/@chamanshah",
        "https://hackernoon.com/u/chamanshah"
    ],
    "founder": {
        "@type": "Person",
        "@id": "https://elesium.online/authors/chaman-shah#person",
        "name": "Chaman Shah",
        "jobTitle": "Principal Systems Architect",
        "sameAs": [
            "https://www.linkedin.com/in/chaman-elesium",
            "https://github.com/655Chaman",
            "https://medium.com/@chamanshah",
            "https://hackernoon.com/u/chamanshah"
        ]
    }
}

# Core Technical Ontologies (Wikidata Q-ID, Wikipedia URL, Google kgmid)
CORE_KNOWLEDGE_ENTITIES: List[Dict[str, Any]] = [
    {
        "@type": "DefinedTerm",
        "name": "Artificial Intelligence",
        "sameAs": "https://www.wikidata.org/wiki/Q11660",
        "identifier": "/m/0mkz",
        "url": "https://www.google.com/search?kgmid=/m/0mkz",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Machine Learning",
        "sameAs": "https://www.wikidata.org/wiki/Q2539",
        "identifier": "/m/01hyh_",
        "url": "https://www.google.com/search?kgmid=/m/01hyh_",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Large Language Model",
        "sameAs": "https://www.wikidata.org/wiki/Q1153059",
        "identifier": "/g/11s_677k1m",
        "url": "https://www.google.com/search?kgmid=/g/11s_677k1m",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Natural Language Processing",
        "sameAs": "https://www.wikidata.org/wiki/Q30642",
        "identifier": "/m/05b1n",
        "url": "https://www.google.com/search?kgmid=/m/05b1n",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Autonomous Agent",
        "sameAs": "https://www.wikidata.org/wiki/Q116139474",
        "identifier": "/g/11t6w8b67f",
        "url": "https://www.google.com/search?kgmid=/g/11t6w8b67f",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Cloud Computing",
        "sameAs": "https://www.wikidata.org/wiki/Q483639",
        "identifier": "/m/0283dt",
        "url": "https://www.google.com/search?kgmid=/m/0283dt",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Graphics Processing Unit",
        "sameAs": "https://www.wikidata.org/wiki/Q178655",
        "identifier": "/m/01k93",
        "url": "https://www.google.com/search?kgmid=/m/01k93",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Retrieval-Augmented Generation",
        "sameAs": "https://www.wikidata.org/wiki/Q125503857",
        "identifier": "RAG_WIKIDATA_Q125503857",
        "url": "https://en.wikipedia.org/wiki/Retrieval-augmented_generation",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Vector Database",
        "sameAs": "https://www.wikidata.org/wiki/Q118745585",
        "identifier": "VECTOR_DB_WIKIDATA_Q118745585",
        "url": "https://en.wikipedia.org/wiki/Vector_database",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Business Process Automation",
        "sameAs": "https://www.wikidata.org/wiki/Q2900762",
        "identifier": "/m/04z9c",
        "url": "https://www.google.com/search?kgmid=/m/04z9c",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Enterprise Software",
        "sameAs": "https://www.wikidata.org/wiki/Q1662918",
        "identifier": "/m/03w7f",
        "url": "https://www.google.com/search?kgmid=/m/03w7f",
        "inDefinedTermSet": "https://www.wikidata.org"
    },
    {
        "@type": "DefinedTerm",
        "name": "Enterprise Resource Planning",
        "sameAs": "https://www.wikidata.org/wiki/Q131201",
        "identifier": "/m/02p4m",
        "url": "https://www.google.com/search?kgmid=/m/02p4m",
        "inDefinedTermSet": "https://www.wikidata.org"
    }
]

# Statutory Frameworks & Government Regulators
STATUTORY_ENTITIES: Dict[str, Dict[str, Any]] = {
    "dpdp": {
        "@type": "Legislation",
        "name": "Digital Personal Data Protection Act, 2023",
        "alternateName": "DPDP Act 2023 (Act No. 22 of 2023)",
        "sameAs": "https://www.wikidata.org/wiki/Q121434948",
        "url": "https://en.wikipedia.org/wiki/Digital_Personal_Data_Protection_Act,_2023"
    },
    "rbi": {
        "@type": "GovernmentOrganization",
        "name": "Reserve Bank of India",
        "alternateName": "RBI",
        "sameAs": "https://www.wikidata.org/wiki/Q126685",
        "identifier": "/m/019y2r",
        "url": "https://www.google.com/search?kgmid=/m/019y2r"
    },
    "sebi": {
        "@type": "GovernmentOrganization",
        "name": "Securities and Exchange Board of India",
        "alternateName": "SEBI",
        "sameAs": "https://www.wikidata.org/wiki/Q3633857",
        "identifier": "/m/046q9q",
        "url": "https://www.google.com/search?kgmid=/m/046q9q"
    },
    "morth": {
        "@type": "GovernmentOrganization",
        "name": "Ministry of Road Transport and Highways",
        "alternateName": "MoRTH",
        "sameAs": "https://www.wikidata.org/wiki/Q6874836",
        "identifier": "/m/047f2_j",
        "url": "https://www.google.com/search?kgmid=/m/047f2_j"
    },
    "cdsco": {
        "@type": "GovernmentOrganization",
        "name": "Central Drugs Standard Control Organisation",
        "alternateName": "CDSCO",
        "sameAs": "https://www.wikidata.org/wiki/Q5009890",
        "identifier": "/m/051y6_z",
        "url": "https://www.google.com/search?kgmid=/m/051y6_z"
    },
    "dgca": {
        "@type": "GovernmentOrganization",
        "name": "Directorate General of Civil Aviation",
        "alternateName": "DGCA",
        "sameAs": "https://www.wikidata.org/wiki/Q5205574",
        "identifier": "/m/05zsg5",
        "url": "https://www.google.com/search?kgmid=/m/05zsg5"
    },
    "trai": {
        "@type": "GovernmentOrganization",
        "name": "Telecom Regulatory Authority of India",
        "alternateName": "TRAI",
        "sameAs": "https://www.wikidata.org/wiki/Q7680072",
        "identifier": "/m/078r4w",
        "url": "https://www.google.com/search?kgmid=/m/078r4w"
    },
    "irdai": {
        "@type": "GovernmentOrganization",
        "name": "Insurance Regulatory and Development Authority",
        "alternateName": "IRDAI",
        "sameAs": "https://www.wikidata.org/wiki/Q6037785",
        "identifier": "/m/026857y",
        "url": "https://www.google.com/search?kgmid=/m/026857y"
    },
    "gdpr": {
        "@type": "Legislation",
        "name": "General Data Protection Regulation",
        "alternateName": "EU GDPR",
        "sameAs": "https://www.wikidata.org/wiki/Q1172284",
        "identifier": "/m/0h54d_v",
        "url": "https://www.google.com/search?kgmid=/m/0h54d_v"
    },
    "hipaa": {
        "@type": "Legislation",
        "name": "Health Insurance Portability and Accountability Act",
        "alternateName": "HIPAA",
        "sameAs": "https://www.wikidata.org/wiki/Q1594191",
        "identifier": "/m/01p2b5",
        "url": "https://www.google.com/search?kgmid=/m/01p2b5"
    }
}

# Metropolitan Geographic Moat Entities
GEOGRAPHIC_ENTITIES: List[Dict[str, Any]] = [
    {
        "@type": "City",
        "name": "Bengaluru",
        "sameAs": "https://www.wikidata.org/wiki/Q1355",
        "identifier": "/m/09c17",
        "url": "https://www.google.com/search?kgmid=/m/09c17"
    },
    {
        "@type": "City",
        "name": "Mumbai",
        "sameAs": "https://www.wikidata.org/wiki/Q1156",
        "identifier": "/m/04vmp",
        "url": "https://www.google.com/search?kgmid=/m/04vmp"
    },
    {
        "@type": "City",
        "name": "Delhi NCR",
        "sameAs": "https://www.wikidata.org/wiki/Q83367",
        "identifier": "/m/093_3",
        "url": "https://www.google.com/search?kgmid=/m/093_3"
    },
    {
        "@type": "City",
        "name": "Hyderabad",
        "sameAs": "https://www.wikidata.org/wiki/Q1361",
        "identifier": "/m/03bwt",
        "url": "https://www.google.com/search?kgmid=/m/03bwt"
    },
    {
        "@type": "City",
        "name": "Pune",
        "sameAs": "https://www.wikidata.org/wiki/Q1538",
        "identifier": "/m/01662y",
        "url": "https://www.google.com/search?kgmid=/m/01662y"
    },
    {
        "@type": "City",
        "name": "Chennai",
        "sameAs": "https://www.wikidata.org/wiki/Q1352",
        "identifier": "/m/0c529",
        "url": "https://www.google.com/search?kgmid=/m/0c529"
    },
    {
        "@type": "Country",
        "name": "India",
        "sameAs": "https://www.wikidata.org/wiki/Q668",
        "identifier": "/m/03rk0",
        "url": "https://www.google.com/search?kgmid=/m/03rk0"
    },
    {
        "@type": "Country",
        "name": "United States",
        "sameAs": "https://www.wikidata.org/wiki/Q30",
        "identifier": "/m/09c7w0",
        "url": "https://www.google.com/search?kgmid=/m/09c7w0"
    },
    {
        "@type": "Country",
        "name": "United Kingdom",
        "sameAs": "https://www.wikidata.org/wiki/Q145",
        "identifier": "/m/07ssc",
        "url": "https://www.google.com/search?kgmid=/m/07ssc"
    },
    {
        "@type": "Country",
        "name": "United Arab Emirates",
        "sameAs": "https://www.wikidata.org/wiki/Q878",
        "identifier": "/m/07t21",
        "url": "https://www.google.com/search?kgmid=/m/07t21"
    }
]

# Thematic Silo Specific Knowledge Graphs & Co-Reference Attributes
SILO_KNOWLEDGE_MESH: Dict[str, Dict[str, Any]] = {
    "logistics": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Supply Chain Management",
            "sameAs": "https://www.wikidata.org/wiki/Q845187",
            "identifier": "/m/0h53_b8",
            "url": "https://www.google.com/search?kgmid=/m/0h53_b8"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Freight Transport",
                "sameAs": "https://www.wikidata.org/wiki/Q11222",
                "identifier": "/m/02vy3",
                "url": "https://www.google.com/search?kgmid=/m/02vy3"
            },
            {
                "@type": "Thing",
                "name": "Vehicle Routing Problem",
                "sameAs": "https://www.wikidata.org/wiki/Q2571217",
                "url": "https://en.wikipedia.org/wiki/Vehicle_routing_problem"
            }
        ],
        "regulators": ["morth", "dgca", "dpdp"]
    },
    "bfsi": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Banking & Financial Services",
            "sameAs": "https://www.wikidata.org/wiki/Q22687",
            "identifier": "/m/0173h_",
            "url": "https://www.google.com/search?kgmid=/m/0173h_"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Underwriting",
                "sameAs": "https://www.wikidata.org/wiki/Q255502",
                "identifier": "/m/03w7r",
                "url": "https://www.google.com/search?kgmid=/m/03w7r"
            },
            {
                "@type": "Thing",
                "name": "Anti-Money Laundering",
                "sameAs": "https://www.wikidata.org/wiki/Q574345",
                "identifier": "/m/046q8z",
                "url": "https://www.google.com/search?kgmid=/m/046q8z"
            }
        ],
        "regulators": ["rbi", "sebi", "irdai", "dpdp"]
    },
    "manufacturing": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Manufacturing Automation",
            "sameAs": "https://www.wikidata.org/wiki/Q187931",
            "identifier": "/m/04t_3",
            "url": "https://www.google.com/search?kgmid=/m/04t_3"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Fourth Industrial Revolution",
                "sameAs": "https://www.wikidata.org/wiki/Q13580556",
                "identifier": "/m/011v9gqz",
                "url": "https://www.google.com/search?kgmid=/m/011v9gqz"
            },
            {
                "@type": "Thing",
                "name": "Predictive Maintenance",
                "sameAs": "https://www.wikidata.org/wiki/Q1753733",
                "url": "https://en.wikipedia.org/wiki/Predictive_maintenance"
            }
        ],
        "regulators": ["dpdp"]
    },
    "healthcare": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Health Informatics",
            "sameAs": "https://www.wikidata.org/wiki/Q18957",
            "identifier": "/m/03w7f",
            "url": "https://www.google.com/search?kgmid=/m/03w7f"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Telemedicine",
                "sameAs": "https://www.wikidata.org/wiki/Q214154",
                "identifier": "/m/01pk3h",
                "url": "https://www.google.com/search?kgmid=/m/01pk3h"
            },
            {
                "@type": "Thing",
                "name": "Ayushman Bharat Digital Mission",
                "sameAs": "https://www.wikidata.org/wiki/Q108782352",
                "url": "https://en.wikipedia.org/wiki/Ayushman_Bharat_Digital_Mission"
            }
        ],
        "regulators": ["cdsco", "dpdp", "hipaa"]
    },
    "pharma": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Pharmaceutical Industry",
            "sameAs": "https://www.wikidata.org/wiki/Q507443",
            "identifier": "/m/05wv2",
            "url": "https://www.google.com/search?kgmid=/m/05wv2"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Clinical Trial",
                "sameAs": "https://www.wikidata.org/wiki/Q30612",
                "identifier": "/m/01m24v",
                "url": "https://www.google.com/search?kgmid=/m/01m24v"
            },
            {
                "@type": "Thing",
                "name": "Title 21 CFR Part 11",
                "sameAs": "https://www.wikidata.org/wiki/Q4630985",
                "url": "https://en.wikipedia.org/wiki/Title_21_CFR_Part_11"
            }
        ],
        "regulators": ["cdsco", "dpdp"]
    },
    "erp": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Enterprise Resource Planning",
            "sameAs": "https://www.wikidata.org/wiki/Q131201",
            "identifier": "/m/02p4m",
            "url": "https://www.google.com/search?kgmid=/m/02p4m"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "SAP S/4HANA",
                "sameAs": "https://www.wikidata.org/wiki/Q19840245",
                "url": "https://en.wikipedia.org/wiki/SAP_S/4HANA"
            },
            {
                "@type": "Thing",
                "name": "Business Process Automation",
                "sameAs": "https://www.wikidata.org/wiki/Q2900762",
                "identifier": "/m/04z9c",
                "url": "https://www.google.com/search?kgmid=/m/04z9c"
            }
        ],
        "regulators": ["dpdp"]
    },
    "telecom": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Telecommunication",
            "sameAs": "https://www.wikidata.org/wiki/Q418",
            "identifier": "/m/07cq3",
            "url": "https://www.google.com/search?kgmid=/m/07cq3"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "5G Network",
                "sameAs": "https://www.wikidata.org/wiki/Q1363628",
                "identifier": "/m/03c40q",
                "url": "https://www.google.com/search?kgmid=/m/03c40q"
            }
        ],
        "regulators": ["trai", "dpdp"]
    },
    "legal": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Legal Technology",
            "sameAs": "https://www.wikidata.org/wiki/Q24911762",
            "url": "https://en.wikipedia.org/wiki/Legal_technology"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Contract Management",
                "sameAs": "https://www.wikidata.org/wiki/Q1755106",
                "url": "https://en.wikipedia.org/wiki/Contract_management"
            }
        ],
        "regulators": ["dpdp", "gdpr"]
    },
    "govtech": {
        "primary_entity": {
            "@type": "Thing",
            "name": "E-Governance",
            "sameAs": "https://www.wikidata.org/wiki/Q1065609",
            "identifier": "/m/0319r9",
            "url": "https://www.google.com/search?kgmid=/m/0319r9"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Digital India",
                "sameAs": "https://www.wikidata.org/wiki/Q20649774",
                "url": "https://en.wikipedia.org/wiki/Digital_India"
            }
        ],
        "regulators": ["dpdp"]
    },
    "aerospace": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Aerospace Engineering",
            "sameAs": "https://www.wikidata.org/wiki/Q22671",
            "identifier": "/m/0j4g",
            "url": "https://www.google.com/search?kgmid=/m/0j4g"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Defense Industry",
                "sameAs": "https://www.wikidata.org/wiki/Q624796",
                "url": "https://en.wikipedia.org/wiki/Arms_industry"
            }
        ],
        "regulators": ["dgca", "dpdp"]
    },
    "energy": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Smart Grid",
            "sameAs": "https://www.wikidata.org/wiki/Q192945",
            "identifier": "/m/051188",
            "url": "https://www.google.com/search?kgmid=/m/051188"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Renewable Energy",
                "sameAs": "https://www.wikidata.org/wiki/Q12705",
                "identifier": "/m/06b_j",
                "url": "https://www.google.com/search?kgmid=/m/06b_j"
            }
        ],
        "regulators": ["dpdp"]
    },
    "mining": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Mining Industry",
            "sameAs": "https://www.wikidata.org/wiki/Q44497",
            "identifier": "/m/04wq9",
            "url": "https://www.google.com/search?kgmid=/m/04wq9"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Mineral Processing",
                "sameAs": "https://www.wikidata.org/wiki/Q1936302",
                "url": "https://en.wikipedia.org/wiki/Mineral_processing"
            }
        ],
        "regulators": ["dpdp"]
    },
    "cybersecurity": {
        "primary_entity": {
            "@type": "Thing",
            "name": "Computer Security",
            "sameAs": "https://www.wikidata.org/wiki/Q3510522",
            "identifier": "/m/017sf6",
            "url": "https://www.google.com/search?kgmid=/m/017sf6"
        },
        "secondary_entities": [
            {
                "@type": "Thing",
                "name": "Security Operations Center",
                "sameAs": "https://www.wikidata.org/wiki/Q7444747",
                "url": "https://en.wikipedia.org/wiki/Security_operations_center"
            },
            {
                "@type": "Thing",
                "name": "Zero Trust Security Model",
                "sameAs": "https://www.wikidata.org/wiki/Q85816912",
                "url": "https://en.wikipedia.org/wiki/Zero_trust_security_model"
            }
        ],
        "regulators": ["sebi", "rbi", "dpdp"]
    }
}
