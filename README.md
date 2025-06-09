# NLP Project - Análisis de Sentimientos y Toxicidad en Redes Sociales UIS

Un proyecto de procesamiento de lenguaje natural enfocado en el análisis de sentimientos, toxicidad y clasificación de género en contenido de redes sociales, desarrollado como parte del Semillero de Investigación en Hands On Computer Vision de la Universidad Industrial de Santander (UIS).

## 🎯 Objetivos

- **Extracción de Datos**: Automatizar la recopilación de datos de plataformas sociales
- **Clasificación de Género**: Determinar el género de usuarios basado en patrones lingüísticos
- **Análisis de Sentimientos**: Evaluar las emociones y polaridad en publicaciones y comentarios de redes sociales
- **Detección de Toxicidad**: Identificar contenido tóxico o dañino en interacciones digitales

## 🏗️ Estructura del Proyecto

```
NLP---Project/
├── 📁 data/                           # Datasets y archivos de datos
│   ├── 2.0_3.0_V1_Cleaned.csv       # Dataset limpio versión 1
│   ├── 2.0_3.0_V2_Cleaned.csv       # Dataset limpio versión 2 
│   ├── 4.0_V1_Cleaned.csv           # Dataset limpio versión 1 
│   ├── 4.0_V2_Cleaned.csv           # Dataset limpio versión 2
│   ├── dataset_comments_with_gender_hybrid.csv  # Comentarios con clasificación de género
│   ├── dataset_completo_Cleaned.csv  # Dataset completo procesado
│   └── dataset_posts_with_gender_hybrid.csv     # Posts con clasificación de género
├── 📁 src/                           # Código fuente
│   ├── 📁 analysis/                  # Análisis y modelos de ML/NLP
│   │   ├── gender_analysis.ipynb     # Análisis y clasificación de género
|   |   ├── mutual_words.ipynb        # Conteo de palabras y frases en publicaciones
│   │   └── sentiment_analysis.ipynb  # Análisis de sentimientos
│   │   
│   └── 📁 scrapers/                  # Scripts de web scraping
│       ├── Scrapping_edge.ipynb      # Scraper principal con Selenium
│       ├── Scrolls.ipynb            # Scripts de navegación automática
│       └── Scrapping_csv.js         # Scraper en JavaScript para CSV
├── 📁 notebooks/                     # Jupyter notebooks adicionales
├── requirements.txt                  # Dependencias de Python
├── LICENSE                          # Licencia Apache 2.0
└── README.md                        # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Python 3.8+
- Node.js (para scrapers en JavaScript)
- Google Chrome/Edge (para Selenium)
- Cuenta de Google Cloud (para APIs de Google Generative AI)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/NLP---Project.git
   cd NLP---Project
   ```

2. **Crear entorno virtual**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # En Windows
   ```

3. **Instalar dependencias**
   ```bash
   pip install -r requirements.txt
   # Requisitos adicionales (descargar manualmente)
   python -m spacy download es_core_news_md
   ```

4. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
     Allí agregar la variables, email y password para logueo en Facebook
   ```
## 📊 Datasets

El proyecto incluye varios datasets pero el principal es:
- **Dataset completo**: Compilación de todos los datos procesados

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia Apache 2.0. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

**Integrantes**
- Alejandro Moreno
- Christian Orduz
- Miguel Ayala
- Sergio Hernández

**Semillero de Investigación en Computer Vision - UIS**
- Universidad Industrial de Santander
- Facultad de Ingenierías Fisicomecánicas
- Escuela de Ingeniería de Sistemas e Informática

## 📧 Contacto

Para preguntas sobre el proyecto, contactar a través del semillero de investigación de la UIS.

## 🙏 Agradecimientos

- Universidad Industrial de Santander (UIS)
- Semillero de Investigación en Computer Vision

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!**
