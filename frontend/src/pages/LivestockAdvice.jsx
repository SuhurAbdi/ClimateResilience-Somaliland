import { useEffect, useState } from "react";
import "../App.css";
import "../styles/livestock-advice.css";

const API_URL = "http://127.0.0.1:8000/api/livestock-advice";

const practicalAdvice = [
  {
    id: "water",
    climate_risk: "Water shortage",
    title_en: "Provide Safe Drinking Water",
    advice_en:
      "Provide livestock with regular access to clean drinking water. Clean water troughs and check water sources frequently. During hot weather and drought, animals may need more water. Arrange alternative water supplies before existing sources run dry. Water needs vary by animal type, age, feed and weather.",
    title_so: "Bixi Biyo Nadiif ah",
    advice_so:
      "Xoolaha sii biyo nadiif ah oo joogto ah. Nadiifi weelasha biyaha, si joogto ahna u hubi ilaha biyaha. Xilliga kulaylka iyo abaarta, xooluhu waxay u baahan karaan biyo dheeraad ah. Diyaari ilo kale oo biyo ah ka hor inta aanay ilihii hore qallalin.",
    source: "General livestock-care guidance; NSW Government",
    source_url:
      "https://www.nsw.gov.au/regional-and-primary-industries/livestock/production/water-for-livestock",
  },
  {
    id: "drought-feed",
    climate_risk: "Drought and pasture shortage",
    title_en: "Plan Feed Supplies Early",
    advice_en:
      "Check grazing areas and animal body condition regularly. If pasture is declining, plan early for suitable hay, fodder or other locally available livestock feed. Introduce unfamiliar feeds gradually and seek advice about safe quantities. Keep feed dry and protected from contamination. If feed cannot meet herd needs, discuss early livestock sales or temporary relocation with experienced livestock advisers.",
    title_so: "Diyaari Quudka Xoolaha",
    advice_so:
      "Si joogto ah u eeg daaqa iyo xaaladda jidhka xoolaha. Haddii daaqii yaraado, hore u sii qorshee caws, calaf ama quudin kale oo ku habboon. Quud cusub si tartiib ah ugu bar xoolaha, kana hubi khabiir qiyaasta ku habboon. Quudka ka ilaali qoyaanka iyo wasakhda. Haddii quudku ku filnaan waayo, kala tasho khabiir iibinta xoolaha qaarkood ama u raridda meel ku habboon.",
    source: "FAO Somalia; livestock drought-response guidance",
    source_url:
      "https://www.fao.org/somalia/news/details/somalia-drought-emergency/en",
  },
  {
    id: "animal-health",
    climate_risk: "Disease and poor animal condition",
    title_en: "Monitor Animal Health",
    advice_en:
      "Observe animals daily for loss of appetite, unusual weakness, difficulty walking, diarrhoea, coughing or sudden changes in behaviour. Contact a qualified veterinarian or animal-health worker when an animal becomes sick. Follow local veterinary advice on vaccination, parasite control and treatment. Do not use antibiotics or other medicines without appropriate professional guidance.",
    title_so: "La Soco Caafimaadka Xoolaha",
    advice_so:
      "Maalin kasta ka fiirso xoolaha cunto diid, tabar-darro, socod ku adkaada, shuban, qufac ama dabeecad aan caadi ahayn. Haddii neef xanuunsado, la xiriir dhakhtar xoolaad ama shaqaale caafimaadka xoolaha oo aqoon leh. Raac talada deegaanka ee tallaalka, ka-hortagga dulinnada iyo daaweynta. Ha siin antibiyootik ama dawo kale adigoon helin talo xirfadeed oo ku habboon.",
    source: "World Organisation for Animal Health (WOAH)",
    source_url:
      "https://www.woah.org/en/what-we-do/animal-health-and-welfare/animal-welfare/",
  },
  {
    id: "heat",
    climate_risk: "Extreme heat",
    title_en: "Reduce Heat Stress",
    advice_en:
      "Provide shade or a cooler resting area where possible. Make clean drinking water available and avoid unnecessary long-distance movement or strenuous handling during the hottest hours. Check young, weak and milk-producing animals more frequently. Seek veterinary help if an animal shows severe weakness, collapse or other signs of serious heat stress.",
    title_so: "Ka Ilaali Xoolaha Kulaylka Badan",
    advice_so:
      "Haddii ay suurtagal tahay, sii xoolaha meel hadh leh ama meel ka qabow oo ay ku nastaan. Biyo nadiif ah u diyaari, kana fogow socod dheer iyo daal gelin xilliyada ugu kulul. Si gaar ah ula soco xoolaha yaryar, kuwa tabarta daran iyo kuwa caanaha laga liso. Haddii neefku aad u tabar-darroodo ama dhaco, raadso caawimaad caafimaadka xoolaha.",
    source: "UK Government; livestock care during extreme weather",
    source_url:
      "https://www.gov.uk/guidance/keeping-farm-animals-and-horses-in-extreme-weather",
  },
  {
    id: "flood",
    climate_risk: "Flooding and heavy rain",
    title_en: "Prepare for Floods",
    advice_en:
      "Identify safer, higher ground and routes away from flood-prone areas before heavy rain. Move animals away from rising water when it is safe to do so. Do not cross fast-moving floodwater with livestock. After flooding, check for injuries and ensure drinking water and feed have not been contaminated. Contact animal-health services if animals become sick.",
    title_so: "U Diyaargarow Daadadka",
    advice_so:
      "Ka hor roobabka culus, aqoonso dhul sare oo ammaan ah iyo waddooyin ka fog meelaha daadadku maraan. Xoolaha ka fogee biyaha soo kacaya marka ay ammaan tahay. Ha la dhex marin xoolaha biyo daad ah oo xoog u socda. Daadka ka dib, hubi dhaawacyada xoolaha, kana ilaali inay cabbaan biyo ama cunaan quud wasakhoobay. Haddii xooluhu xanuunsadaan, la xiriir adeegga caafimaadka xoolaha.",
    source: "General livestock safety guidance for floods",
    source_url:
      "https://www.gov.uk/guidance/keeping-farm-animals-and-horses-in-extreme-weather",
  },
  {
    id: "pasture",
    climate_risk: "Declining pasture",
    title_en: "Protect Grazing Resources",
    advice_en:
      "Avoid concentrating too many animals in one grazing area for too long. Where local conditions allow, rotate grazing areas and give vegetation time to recover. Discuss suitable herd size, seasonal movement and locally appropriate fodder options with pastoral extension workers. Protect important water points and avoid damaging fragile land around them.",
    title_so: "Ilaali Daaqa Xoolaha",
    advice_so:
      "Ka fogow in xoolo aad u badan muddo dheer lagu hayo hal meel oo daaq ah. Haddii xaaladda deegaanka saamaxdo, beddel meelaha daaqa si dhirtu waqti ugu hesho inay dib u soo baxdo. Kala tasho shaqaalaha horumarinta xoolaha tirada xoolaha ku habboon, guuritaanka xilliyeed iyo noocyada calafka deegaanka ku habboon. Ilaali ilaha biyaha, kana fogow waxyeellaynta dhulka jilicsan ee ku hareeraysan.",
    source: "FAO; pastoralist resilience and fodder systems",
    source_url:
      "https://www.fao.org/africa/news-stories/news-detail/strengthening-pastoralist-resilience--lessons-from-somalia-and-mali/",
  },
];

function LivestockAdvice() {
  const [adviceList, setAdviceList] = useState(practicalAdvice);
  const [loading, setLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState(
    "Showing general practical guidance. These are not live veterinary alerts.",
  );
  const [language, setLanguage] = useState("both");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAdvice() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("The advice API is currently unavailable.");
        }

        const result = await response.json();
        const records = Array.isArray(result) ? result : result.data;

        if (!Array.isArray(records)) {
          throw new Error("Unexpected API response.");
        }

        if (cancelled) return;

        if (records.length > 0) {
          // Keep the practical guidance and add database records.
          const combined = [
            ...practicalAdvice,
            ...records.map((item) => ({
              ...item,
              id: `api-${item.id}`,
              source: item.source || "Database entry; source not specified",
            })),
          ];

          setAdviceList(combined);
          setApiMessage(
            "Practical guidance is shown alongside advice from your database. Check each source before relying on it.",
          );
        } else {
          setApiMessage(
            "Your database has no advice records yet. Showing built-in practical guidance.",
          );
        }
      } catch {
        if (!cancelled) {
          setApiMessage(
            "The Laravel API is unavailable. Showing built-in practical guidance instead.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAdvice();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAdvice = adviceList.filter((item) => {
    const searchText = [
      item.climate_risk,
      item.title_en,
      item.advice_en,
      item.title_so,
      item.advice_so,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Livestock Adaptation Advice</h1>

      <p className="page-description">
        Practical guidance for pastoralist communities protecting camels, goats,
        sheep and cattle from drought, water shortages, heat, flooding and
        animal-health risks in Somaliland.
      </p>

      <div className="livestock-notice" role="note">
        <strong>Important:</strong> This page provides general guidance, not a
        live forecast or a veterinary diagnosis. For sick animals, medicine,
        vaccination and feed quantities, consult a qualified local animal-health
        professional.
      </div>

      <p className="livestock-api-message" role="status">
        {loading ? "Checking the advice database..." : apiMessage}
      </p>

      <div className="livestock-controls">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search drought, water, disease..."
          aria-label="Search livestock advice"
        />

        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label="Choose advice language"
        >
          <option value="both">English and Somali</option>
          <option value="en">English only</option>
          <option value="so">Af-Soomaali oo keliya</option>
        </select>
      </div>

      <h2 className="section-title">Practical Livestock Guidance</h2>

      {filteredAdvice.length === 0 && (
        <p className="status-message empty-message">
          No advice matches your search. Try another word.
        </p>
      )}

      <div className="forecast-grid">
        {filteredAdvice.map((advice) => (
          <article
            className="forecast-card livestock-advice-card"
            key={advice.id}
          >
            <span className="advice-category">🐪 {advice.climate_risk}</span>

            {language !== "so" && (
              <div className="advice-language-section">
                <h2>{advice.title_en}</h2>
                <p>{advice.advice_en}</p>
              </div>
            )}

            {language === "both" && <hr className="page-divider" />}

            {language !== "en" && (
              <div className="advice-language-section" lang="so">
                <h3>{advice.title_so}</h3>
                <p>{advice.advice_so}</p>
              </div>
            )}

            <p className="advice-source">
              <strong>Reference:</strong> {advice.source}
            </p>

            {advice.source_url && (
              <a
                className="livestock-source-link"
                href={advice.source_url}
                target="_blank"
                rel="noreferrer"
              >
                Read guidance from the source
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export default LivestockAdvice;
