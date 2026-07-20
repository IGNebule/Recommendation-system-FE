import { useEffect, useState } from "react";
import { reportService } from "../services";
import useAuth from "../hooks/useAuth";

// Edit these three values for your own project identity.
const WEBSITE_NAME = "GAME RECOMMENDATION SYSTEM";
const WEBSITE_SUBTITLE =
  "Content-Based Filtering Using TF-IDF and Cosine Similarity";
const PRINT_LOGO_SRC = "/GameReco_bl.png";

const REPORT_OPTIONS = [
  {
    id: "analysis",
    label: "Data Analysis",
  },
  {
    id: "corpus",
    label: "Corpus Distribution",
  },
  {
    id: "mathematical",
    label: "Mathematical Reports",
  },
  {
    id: "distribution",
    label: "Top Genres, Categories & Tags",
  },
];

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
};

const formatPercent = (value) => {
  const num = Number(value);

  if (!Number.isFinite(num)) return "0.00%";

  return `${num.toFixed(2)}%`;
};

const MetricCard = ({ label, value, description }) => {
  return (
    <div className="border border-white/10 bg-[#120f1d]/80 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[#9CA3AF]">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-semibold text-white">{value}</h3>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
      ) : null}
    </div>
  );
};

const SectionCard = ({ eyebrow, title, children }) => {
  return (
    <section className="mb-8 border border-white/10 bg-[#0d0a16]/85 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      {eyebrow ? (
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#7cccf5]">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mb-5 text-xl font-normal uppercase text-white">{title}</h2>

      {children}
    </section>
  );
};

const FormulaBlock = ({ children }) => {
  return (
    <div className="my-4 overflow-x-auto border border-[#2D2643] bg-black/30 p-4">
      <code className="whitespace-pre-wrap text-sm leading-7 text-[#d8cdfc]">
        {children}
      </code>
    </div>
  );
};

const DistributionTable = ({ rows = [] }) => {
  return (
    <div className="overflow-x-auto border border-white/10">
      <table className="w-full min-w-[780px] border-collapse text-left text-sm">
        <thead className="bg-white/10 text-xs uppercase tracking-[0.18em] text-white/70">
          <tr>
            <th className="px-4 py-4">Genre / Meta Tag</th>
            <th className="px-4 py-4">Document Frequency</th>
            <th className="px-4 py-4">% of Corpus</th>
            <th className="px-4 py-4">Algorithmic Impact</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.key || row.term || row.label}
              className="border-t border-white/10 bg-[#120f1d]/70"
            >
              <td className="px-4 py-4 font-semibold text-white">
                {row.label || row.term}
              </td>

              <td className="px-4 py-4 text-white/75">
                {formatNumber(row.documentFrequency)}
              </td>

              <td className="px-4 py-4 text-white/75">
                {formatPercent(row.percentage)}
              </td>

              <td className="px-4 py-4 leading-6 text-white/60">
                {row.impact || "Corpus-level term distribution."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CompactTable = ({ title, rows = [] }) => {
  return (
    <div className="border border-white/10 bg-[#120f1d]/70">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold uppercase text-white">{title}</h3>
      </div>

      <div className="max-h-[340px] overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-[#171224] text-xs uppercase text-white/60">
            <tr>
              <th className="px-4 py-3">Term</th>
              <th className="px-4 py-3">DF</th>
              <th className="px-4 py-3">%</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.term} className="border-t border-white/10">
                <td className="px-4 py-3 text-white">{row.term}</td>
                <td className="px-4 py-3 text-white/70">
                  {formatNumber(row.documentFrequency)}
                </td>
                <td className="px-4 py-3 text-white/70">
                  {formatPercent(row.percentage)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --------------------------------------------------------
// PRINT-ONLY COMPONENTS
// The screen dashboard stays unchanged. These appear only
// after the user selects reports and opens browser printing.
// --------------------------------------------------------

const PrintSection = ({ number, title, children, pageBreak = false }) => {
  return (
    <section className={`mb-6 ${pageBreak ? "print:break-before-page" : ""}`}>
      {children}
    </section>
  );
};

const PrintMetricTable = ({ rows = [] }) => {
  return (
    <table className="w-full border-collapse text-[10px] text-black">
      <thead>
        <tr className="bg-[#eeeeee]">
          <th className="w-10 border border-black px-2 py-2 text-center">No</th>
          <th className="border border-black px-2 py-2 text-left">Metric</th>
          <th className="w-[180px] border border-black px-2 py-2 text-right">
            Value
          </th>
          <th className="border border-black px-2 py-2 text-left">
            Description
          </th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <tr key={row.label}>
            <td className="border border-black px-2 py-2 text-center">
              {index + 1}
            </td>
            <td className="border border-black px-2 py-2 font-semibold">
              {row.label}
            </td>
            <td className="border border-black px-2 py-2 text-right">
              {row.value}
            </td>
            <td className="border border-black px-2 py-2">{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PrintCorpusDistributionTable = ({ rows = [] }) => {
  return (
    <table className="w-full border-collapse text-[10px] text-black">
      <thead>
        <tr className="bg-[#eeeeee]">
          <th className="w-10 border border-black px-2 py-2 text-center">No</th>
          <th className="border border-black px-2 py-2 text-left">
            Genre / Meta Tag
          </th>
          <th className="w-[145px] border border-black px-2 py-2 text-center">
            Document Frequency
          </th>
          <th className="w-[115px] border border-black px-2 py-2 text-center">
            % of Corpus
          </th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <tr key={row.key || row.term || row.label}>
            <td className="border border-black px-2 py-2 text-center">
              {index + 1}
            </td>
            <td className="border border-black px-2 py-2 font-semibold">
              {row.label || row.term}
            </td>
            <td className="border border-black px-2 py-2 text-center">
              {formatNumber(row.documentFrequency)}
            </td>
            <td className="border border-black px-2 py-2 text-center">
              {formatPercent(row.percentage)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const PrintTermTable = ({ title, rows = [] }) => {
  return (
    <div className="mb-5">
      <h3 className="mb-2 text-[11px] font-bold uppercase text-black">
        {title}
      </h3>

      <table className="w-full border-collapse text-[10px] text-black">
        <thead>
          <tr className="bg-[#eeeeee]">
            <th className="w-10 border border-black px-2 py-2 text-center">
              No
            </th>
            <th className="border border-black px-2 py-2 text-left">Term</th>
            <th className="w-[145px] border border-black px-2 py-2 text-center">
              Document Frequency
            </th>
            <th className="w-[115px] border border-black px-2 py-2 text-center">
              % of Corpus
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={`${title}-${row.term}`}>
              <td className="border border-black px-2 py-2 text-center">
                {index + 1}
              </td>
              <td className="border border-black px-2 py-2">{row.term}</td>
              <td className="border border-black px-2 py-2 text-center">
                {formatNumber(row.documentFrequency)}
              </td>
              <td className="border border-black px-2 py-2 text-center">
                {formatPercent(row.percentage)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PrintReportDocument = ({
  report,
  selectedSections,
  getPrintReportType,
}) => {
  const { user } = useAuth();
  const ui = report?.uiDataset || {};
  const ml = report?.mlCorpus || {};

  const showAnalysis = selectedSections.includes("analysis");
  const showCorpus = selectedSections.includes("corpus");
  const showMathematical = selectedSections.includes("mathematical");
  const showDistribution = selectedSections.includes("distribution");

  const orderedSectionIds = [
    "analysis",
    "corpus",
    "mathematical",
    "distribution",
  ].filter((sectionId) => selectedSections.includes(sectionId));

  const getSectionNumber = (sectionId) => {
    const sectionIndex = orderedSectionIds.indexOf(sectionId);
    return sectionIndex >= 0 ? sectionIndex + 1 : "";
  };

  const shouldStartNewPage = (sectionId) => {
    return orderedSectionIds.indexOf(sectionId) > 0;
  };

  const printDate = new Date();

  const dayName = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
  }).format(printDate);

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(printDate);

  const analysisRows = [
    {
      label: "UI Dataset Size",
      value: formatNumber(ui.totalGames),
      description: "Jumlah game yang diproses dari games_ui.csv.",
    },
    {
      label: "ML Corpus Size (N)",
      value: formatNumber(ml.total_documents),
      description: "Jumlah dokumen game pada games_content.csv.",
    },
    {
      label: "Unique Vocabulary Size (V)",
      value: formatNumber(ml.vocabulary_size),
      description: "Jumlah fitur unik yang dibentuk TF-IDF.",
    },
    {
      label: "Total Document Tokens",
      value: formatNumber(ml.total_document_tokens),
      description: "Jumlah token corpus sebelum pembobotan TF-IDF.",
    },
  ];

  const mathematicalRows = [
    {
      label: "TF-IDF Matrix Shape",
      value: `${ml.tfidf_shape?.[0] || 0} × ${ml.tfidf_shape?.[1] || 0}`,
      description: "Dimensi matriks dokumen dan vocabulary TF-IDF.",
    },
    {
      label: "Non-Zero Elements",
      value: formatNumber(ml.non_zero_elements),
      description: "Jumlah elemen berbobot pada sparse TF-IDF matrix.",
    },
    {
      label: "Current Matrix Sparsity",
      value: formatPercent(ml.matrix_sparsity_percent),
      description: "Persentase sel kosong dalam matriks TF-IDF.",
    },
  ];

  return (
    <article
      id="report-print-document"
      className="hidden bg-white font-sans text-black print:block"
    >
      <header className="mb-5 border-b-2 border-black pb-3">
        <div className="relative min-h-[76px]">
          <img
            src={PRINT_LOGO_SRC}
            alt={`${WEBSITE_NAME} logo`}
            className="absolute left-0 top-0 h-[100px] w-[100px] object-contain"
          />

          <div className="px-20 text-center">
            <h1 className="text-[18px] font-bold uppercase tracking-wide text-black">
              {WEBSITE_NAME}
            </h1>

            <p className="mt-1 text-[10px] text-black">{WEBSITE_SUBTITLE}</p>

            <p className="mt-1 text-[9px] text-black/75">
              Technical Analytics Report • TF-IDF • Cosine Similarity
            </p>
          </div>
        </div>

        <div className="mt-3 border-t border-black pt-2 text-center">
          <h2 className="text-[16px] font-bold uppercase tracking-wide text-black">
            Laporan {getPrintReportType()}
          </h2>
        </div>
      </header>

      {showAnalysis ? (
        <PrintSection
          number={getSectionNumber("analysis")}
          title="Data Analysis"
          pageBreak={shouldStartNewPage("analysis")}
        >
          <PrintMetricTable rows={analysisRows} />
        </PrintSection>
      ) : null}

      {showCorpus ? (
        <PrintSection
          number={getSectionNumber("corpus")}
          title="Corpus Distribution"
          pageBreak={shouldStartNewPage("corpus")}
        >
          <PrintCorpusDistributionTable rows={ui.targetDistribution || []} />
        </PrintSection>
      ) : null}

      {showMathematical ? (
        <PrintSection
          number={getSectionNumber("mathematical")}
          title="Mathematical Reports"
          pageBreak={shouldStartNewPage("mathematical")}
        >
          <PrintMetricTable rows={mathematicalRows} />
        </PrintSection>
      ) : null}

      {showDistribution ? (
        <PrintSection
          number={getSectionNumber("distribution")}
          title="Top Corpus Distributions"
          pageBreak={shouldStartNewPage("distribution")}
        >
          <PrintTermTable
            title="Top Genres"
            rows={ui.genreDistribution || []}
          />

          <PrintTermTable
            title="Top Categories"
            rows={ui.categoryDistribution || []}
          />

          <PrintTermTable title="Top Tags" rows={ui.tagDistribution || []} />
        </PrintSection>
      ) : null}
      <div className="mt-16 flex justify-end">
        <table className="border-collapse text-sm text-black">
          <tbody>
            <tr>
              <td className="pb-2 flex justify-center">Jakarta, {dayName} {formattedDate}</td>
            </tr>

            <tr>
              <td className="pb-10 flex justify-center">User</td>
            </tr>

            <tr>
              <td className="pt-2 font-semibold flex justify-center">
                {user?.name ?? "Ikhlas Gunawan"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>
  );
};

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [debugInput, setDebugInput] = useState(
    "Cyberpunk tactical and turn-based RPG",
  );
  const [debugResult, setDebugResult] = useState(null);
  const [debugLoading, setDebugLoading] = useState(false);

  // Controls only the print-selection popup and print layout.
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const [printError, setPrintError] = useState("");
  const [selectedPrintSections, setSelectedPrintSections] = useState(
    REPORT_OPTIONS.map((option) => option.id),
  );

  useEffect(() => {
    let active = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await reportService.getReport();

        if (!active) return;

        setReport(data);
      } catch (err) {
        if (!active) return;

        setError(err.message || "Failed to load report.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadReport();

    return () => {
      active = false;
    };
  }, []);

  const handleDebug = async () => {
    try {
      setDebugLoading(true);
      setDebugResult(null);

      const data = await reportService.debugVector(debugInput);

      setDebugResult(data);
    } catch (err) {
      setDebugResult({
        error: err.message || "Failed to run vector diagnostic.",
      });
    } finally {
      setDebugLoading(false);
    }
  };

  const togglePrintSection = (sectionId) => {
    setPrintError("");

    setSelectedPrintSections((previous) => {
      if (previous.includes(sectionId)) {
        return previous.filter((id) => id !== sectionId);
      }

      return [...previous, sectionId];
    });
  };

  const selectAllPrintSections = () => {
    setPrintError("");
    setSelectedPrintSections(REPORT_OPTIONS.map((option) => option.id));
  };

  const clearPrintSections = () => {
    setPrintError("");
    setSelectedPrintSections([]);
  };

  const getPrintReportType = () => {
    const selected = REPORT_OPTIONS.filter((option) =>
      selectedPrintSections.includes(option.id),
    );

    if (selected.length === REPORT_OPTIONS.length) {
      return "Laporan Lengkap Data Analisis";
    }

    if (selected.length === 1) {
      return selected[0].label;
    }

    return selected.map((option) => option.label).join(" • ");
  };

  const handlePrintSelected = () => {
    if (selectedPrintSections.length === 0) {
      setPrintError("Pilih minimal satu jenis laporan untuk dicetak.");
      return;
    }

    setPrintError("");
    setPrintMenuOpen(false);

    // Let React render the final selected print-only document first.
    window.setTimeout(() => {
      window.print();
    }, 120);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10">
        <div className="border border-white/10 bg-[#0d0a16] p-8 text-white">
          Generating combined CSV report...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1260px] px-4 py-10">
        <div className="border border-red-500/30 bg-red-950/30 p-8 text-red-200">
          {error}
        </div>
      </div>
    );
  }

  const ui = report?.uiDataset || {};
  const ml = report?.mlCorpus || {};

  return (
    <>
      {/* A4 browser printing setup. */}
      <style>{`
        @page {
          size: A4;
          margin: 12mm 13mm;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Hide every web-page element: navbar, page shell, footer, and background. */
          body * {
            visibility: hidden !important;
          }

          /* Reveal and print only the dedicated white report document. */
          #report-print-document,
          #report-print-document * {
            visibility: visible !important;
          }

          #report-print-document {
            display: block !important;
            position: absolute !important;
            inset: 0 auto auto 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* CURRENT DASHBOARD: stays exactly as a screen-only page */}
      <div className="w-full pb-14 text-white print:hidden">
        <div className="mx-auto w-full max-w-[1260px] px-4 py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 border border-white/10 bg-gradient-to-r from-[#1d1830]/90 via-[#161224]/90 to-[#020105]/90 p-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-[#7cccf5]">
                System Report
              </p>

              <h1 className="text-3xl font-semibold uppercase text-white">
                Recommendation Engine Analytics
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65">
                This report combines the backend UI dataset from games_ui.csv
                and the ML corpus from games_content.csv. The backend describes
                metadata distribution, while the ML service exposes the real
                TF-IDF matrix used for cosine similarity.
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setPrintMenuOpen((previous) => !previous)}
                className="border border-[#7C3AED] bg-[#7C3AED] px-5 py-3 text-sm font-semibold uppercase text-white transition hover:bg-[#7cccf5] hover:text-[#080510]"
              >
                Choose & Print Reports
              </button>

              {printMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[360px] border border-white/15 bg-[#171224] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <h3 className="text-sm font-semibold uppercase text-white">
                      Select Reports to Print
                    </h3>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={selectAllPrintSections}
                        className="text-xs text-[#7cccf5] hover:text-white"
                      >
                        Select all
                      </button>

                      <button
                        type="button"
                        onClick={clearPrintSections}
                        className="text-xs text-white/60 hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 py-4">
                    {REPORT_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-center gap-3 text-sm text-white/85"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPrintSections.includes(option.id)}
                          onChange={() => togglePrintSection(option.id)}
                          className="h-4 w-4 cursor-pointer accent-[#7C3AED]"
                        />

                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {printError ? (
                    <p className="mb-4 text-xs text-red-300">{printError}</p>
                  ) : null}

                  <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setPrintMenuOpen(false)}
                      className="px-3 py-2 text-xs font-semibold uppercase text-white/60 transition hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handlePrintSelected}
                      className="bg-white px-4 py-2 text-xs font-bold uppercase text-[#100b19] transition hover:bg-[#7cccf5]"
                    >
                      Print Selected
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <SectionCard
            eyebrow="01"
            title="Exploratory Data Analysis & Corpus Metrics"
          >
            <p className="mb-5 text-sm leading-7 text-white/65">
              Before vector space modeling can occur, the raw relational data is
              processed into two operational datasets: games_ui.csv for backend
              UI enrichment and games_content.csv for ML vectorization.
            </p>

            <div className="mb-7 grid gap-4 md:grid-cols-3">
              <MetricCard
                label="UI Dataset Size"
                value={formatNumber(ui.totalGames)}
                description="Games parsed from games_ui.csv and active in Node cache."
              />

              <MetricCard
                label="ML Corpus Size (N)"
                value={formatNumber(ml.total_documents)}
                description="Documents loaded from games_content.csv inside the FastAPI ML service."
              />

              <MetricCard
                label="Unique Vocabulary Size (V)"
                value={formatNumber(ml.vocabulary_size)}
                description="Vocabulary generated by the fitted TF-IDF vectorizer."
              />

              <MetricCard
                label="Total Document Tokens"
                value={formatNumber(ml.total_document_tokens)}
                description="Gross token count from the ML content corpus before vector weighting."
              />

              <MetricCard
                label="Average Rating"
                value={formatPercent(ui.averageRatingPercent)}
                description="Average rating percentage from the UI dataset."
              />

              <MetricCard
                label="Total Reviews"
                value={formatNumber(ui.totalReviews)}
                description="Total review volume available in games_ui.csv."
              />
            </div>

            <h3 className="mb-4 text-base font-semibold uppercase text-white">
              Corpus Attribute Distribution
            </h3>

            <DistributionTable rows={ui.targetDistribution || []} />
          </SectionCard>

          <SectionCard eyebrow="02" title="The Mathematical Framework">
            <p className="text-sm leading-7 text-white/65">
              The recommendation engine transforms game metadata and descriptive
              text into real-valued vectors using Term Frequency-Inverse
              Document Frequency. Directional similarity is computed through
              cosine similarity.
            </p>

            <h3 className="mt-6 text-base font-semibold uppercase text-white">
              A. Mathematical Formulation
            </h3>

            <FormulaBlock>
              {`tf-idf(t, d, D) = tf(t, d) × idf(t, D)

idf(t, D) = log( |D| / (1 + |{ d ∈ D : t ∈ d }|) )`}
            </FormulaBlock>

            <FormulaBlock>
              {`Cosine Similarity(U, G) = (U · G) / (||U|| ||G||)

Cosine Similarity(U, G) =
Σ(UᵢGᵢ) / ( sqrt(ΣUᵢ²) × sqrt(ΣGᵢ²) )`}
            </FormulaBlock>

            <h3 className="mt-6 text-base font-semibold uppercase text-white">
              B. Matrix Sparsity Report
            </h3>

            <FormulaBlock>
              {`Matrix Sparsity = 1 - ( Non-Zero Elements / (N × V) )`}
            </FormulaBlock>

            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                label="TF-IDF Matrix Shape"
                value={`${ml.tfidf_shape?.[0] || 0} × ${ml.tfidf_shape?.[1] || 0}`}
                description="Document count multiplied by vector vocabulary size."
              />

              <MetricCard
                label="Non-Zero Elements"
                value={formatNumber(ml.non_zero_elements)}
                description="Active weighted term positions inside the sparse TF-IDF matrix."
              />

              <MetricCard
                label="Current Matrix Sparsity"
                value={formatPercent(ml.matrix_sparsity_percent)}
                description="Percentage of empty cells inside the TF-IDF matrix."
              />
            </div>

            <p className="mt-5 text-sm leading-7 text-white/65">
              High sparsity mathematically justifies TF-IDF over a naive boolean
              tag match. It allows rare intersecting keywords to dominate the
              highest cosine similarity results.
            </p>
          </SectionCard>

          <SectionCard eyebrow="03" title="Runtime System Telemetry">
            <div className="border border-[#2D2643] bg-black/30 p-5 font-mono text-sm leading-8 text-[#d8cdfc]">
              <p>
                [ CACHE STATUS: {ui.cacheStatus?.cached ? "ACTIVE" : "COLD"} ]
              </p>
              <p>• UI CSV Source: {ui.source}</p>
              <p>• ML CSV Source: {ml.source}</p>
              <p>• UI CSV Ingestion: {ui.ingestionMs} ms</p>
              <p>• Backend Cache Loaded At: {ui.loadedAt || "N/A"}</p>
              <p>• Report Generated At: {report?.generatedAt}</p>
              <p>
                • Vectorizer: {ml.vectorizer?.type} / max_features=
                {ml.vectorizer?.max_features} / stop_words=
                {ml.vectorizer?.stop_words}
              </p>
            </div>

            <h3 className="mt-6 text-base font-semibold uppercase text-white">
              Computational Complexity Profile
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <MetricCard
                label="Vector Construction Complexity"
                value="O(N · L)"
                description="Executed when the ML service fits the TF-IDF matrix, where L is average document length."
              />

              <MetricCard
                label="Retrieval Complexity"
                value="O(N · V)"
                description="Cosine similarity compares one selected vector against the fitted corpus matrix."
              />
            </div>
          </SectionCard>

          <SectionCard eyebrow="04" title="Interactive Vector Debugger">
            <p className="mb-5 text-sm leading-7 text-white/65">
              This sandbox sends text to the ML service and returns the actual
              analyzer output from the fitted TF-IDF vectorizer.
            </p>

            <div className="flex flex-col gap-3 md:flex-row">
              <input
                value={debugInput}
                onChange={(e) => setDebugInput(e.target.value)}
                placeholder="Paste a game description summary..."
                className="h-11 flex-1 border border-[#2D2643] bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED]"
              />

              <button
                type="button"
                onClick={handleDebug}
                disabled={debugLoading}
                className="border border-[#7C3AED] bg-[#7C3AED] px-5 py-3 text-sm font-semibold uppercase text-white transition hover:bg-[#7cccf5] hover:text-[#080510] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {debugLoading ? "Running..." : "Run Algorithmic Diagnostic"}
              </button>
            </div>

            {debugResult ? (
              <div className="mt-6 grid gap-4">
                {debugResult.error ? (
                  <div className="border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
                    {debugResult.error}
                  </div>
                ) : (
                  <>
                    <div className="border border-white/10 bg-[#120f1d]/70 p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase text-white">
                        Stage 1: Tokenization & Normalization
                      </h3>
                      <p className="break-words text-sm leading-7 text-white/65">
                        {JSON.stringify(
                          debugResult.stage_1_tokenization_normalization,
                        )}
                      </p>
                    </div>

                    <div className="border border-white/10 bg-[#120f1d]/70 p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase text-white">
                        Stage 2: Stop-Word Elimination
                      </h3>
                      <p className="break-words text-sm leading-7 text-white/65">
                        {JSON.stringify(
                          debugResult.stage_2_stop_word_elimination,
                        )}
                      </p>
                    </div>

                    <div className="border border-white/10 bg-[#120f1d]/70 p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase text-white">
                        Stage 3: Local TF-IDF Weight Metrics
                      </h3>
                      <pre className="overflow-x-auto text-sm leading-7 text-white/65">
                        {JSON.stringify(
                          debugResult.stage_3_tfidf_weights,
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </SectionCard>

          <SectionCard
            eyebrow="05"
            title="Algorithmic Boundaries & Mitigation Protocol"
          >
            <div className="grid gap-4">
              <div className="border border-white/10 bg-[#120f1d]/70 p-5">
                <h3 className="mb-2 text-base font-semibold uppercase text-white">
                  The Cold Start Boundary
                </h3>
                <p className="text-sm leading-7 text-white/65">
                  Traditional collaborative filtering systems require user
                  activity before generating meaningful recommendations. This
                  content-based system bypasses user cold-start by mapping game
                  metadata directly into the vector matrix.
                </p>
              </div>

              <div className="border border-white/10 bg-[#120f1d]/70 p-5">
                <h3 className="mb-2 text-base font-semibold uppercase text-white">
                  The Descriptive Sparsity Penalty
                </h3>
                <p className="text-sm leading-7 text-white/65">
                  Minimal descriptions may fail to produce strong term variance.
                  The backend mitigates this by aggregating genres, categories,
                  and tags into browseText before the UI dataset is served.
                </p>
              </div>

              <div className="border border-white/10 bg-[#120f1d]/70 p-5">
                <h3 className="mb-2 text-base font-semibold uppercase text-white">
                  Production Scaling Roadmap
                </h3>
                <p className="text-sm leading-7 text-white/65">
                  To move beyond an academic prototype, the O(N · V) scan should
                  be migrated to a vector database strategy such as PostgreSQL
                  with pgvector and HNSW indexing for approximate
                  nearest-neighbor retrieval.
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard eyebrow="06" title="Top Corpus Distributions">
            <div className="grid gap-4 lg:grid-cols-3">
              <CompactTable
                title="Top Genres"
                rows={ui.genreDistribution || []}
              />

              <CompactTable
                title="Top Categories"
                rows={ui.categoryDistribution || []}
              />

              <CompactTable title="Top Tags" rows={ui.tagDistribution || []} />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* PRINT DOCUMENT: Only this formal paper is printed. */}
      <PrintReportDocument
        report={report}
        selectedSections={selectedPrintSections}
        getPrintReportType={getPrintReportType}
      />
    </>
  );
};

export default ReportPage;
