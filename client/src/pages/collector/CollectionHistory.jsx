import { useCallback, useEffect, useState } from "react";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { getCollectionHistory } from "../../api/collectorApi.js";
import SubmissionTable from "../../components/collector/SubmissionTable.jsx";

export default function CollectionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      const response = await getCollectionHistory();
      setSubmissions(
        Array.isArray(response.data?.data) ? response.data.data : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load collection history."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Collection History</h1>
          <p className="page-subtitle">
            All collection submissions assigned to your account.
          </p>
        </div>
        <button className="btn btn-sm" onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert" style={{ color: "#b91c1c" }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <LoaderCircle size={25} className="animate-spin" />
            <div>Loading collection history...</div>
          </div>
        ) : (
          <SubmissionTable submissions={submissions} />
        )}
      </div>
    </>
  );
}
