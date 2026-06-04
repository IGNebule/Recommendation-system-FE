import { useEffect, useState } from "react";
import { reportService } from "../services";

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

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [debugInput, setDebugInput] = useState(
    "Cyberpunk tactical and turn-based RPG",
  );
  const [debugResult, setDebugResult] = useState(null);
  const [debugLoading, setDebugLoading] = useState(false);

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

  const handlePrint = () => {
    window.print();
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
    <div className="w-full pb-14 text-white">
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
              This report combines the backend UI dataset from games_ui.csv and
              the ML corpus from games_content.csv. The backend describes
              metadata distribution, while the ML service exposes the real
              TF-IDF matrix used for cosine similarity.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="print:hidden border border-[#7C3AED] bg-[#7C3AED] px-5 py-3 text-sm font-semibold uppercase text-white transition hover:bg-[#7cccf5] hover:text-[#080510]"
          >
            Print Report
          </button>
        </div>

        <SectionCard
          eyebrow="01"
          title="Exploratory Data Analysis & Corpus Metrics"
        >
          <p className="mb-5 text-sm leading-7 text-white/65">
            Before vector space modeling can occur, the raw relational data is
            processed into two operational datasets: games_ui.csv for backend UI
            enrichment and games_content.csv for ML vectorization.
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
            text into real-valued vectors using Term Frequency-Inverse Document
            Frequency. Directional similarity is computed through cosine
            similarity.
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
                with pgvector and HNSW indexing for approximate nearest-neighbor
                retrieval.
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
  );
};

export default ReportPage;
