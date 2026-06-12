import { useEffect, useState } from "react";
import SubmissionTable from "../../components/collector/SubmissionTable.jsx";
import { getCollectionHistory } from "../../api/collectorApi.js";

export default function CollectionHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getCollectionHistory()
      .then(({ data }) => {
        if (!active) return;
        setHistory(data.data || data || []);
      })
      .catch(() => {
        if (active) setHistory([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Collection History</h1>
          <p className="page-subtitle">Live record of submissions verified from your assigned collection points.</p>
        </div>
      </div>
      {loading ? <div className="loader"><span className="spinner" /> Loading history...</div> : <SubmissionTable submissions={history} />}
    </>
  );
}
