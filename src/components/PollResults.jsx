import React, { useState, useEffect } from 'react';

function PollResults({ pollId }) {
  const [irvResult, setIrvResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIrvResult = async () => {
      if (!pollId) {
        setError(new Error("Poll ID is required to fetch results."));
        setLoading(false);
        return;
      }

      try {
        const irvResponse = await fetch(`/api/pollresults/${pollId}/irv-result`);
        if (!irvResponse.ok) {
          const errorData = await irvResponse.json();
          throw new Error(`HTTP error! status: ${irvResponse.status} - ${errorData.message || 'Error fetching IRV result'}`);
        }
        const irvResultData = await irvResponse.json();
        setIrvResult(irvResultData);

      } catch (err) {
        setError(err);
        setIrvResult({ winner: null, message: `Failed to load IRV results: ${err.message}` });
      } finally {
        setLoading(false);
      }
    };

    fetchIrvResult();
  }, [pollId]);

  if (loading) {
    return <div>Loading poll results...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const displayWinner = irvResult ? (
    irvResult.winner ? (
      <p>Winner: <strong>{irvResult.winner}</strong></p>
    ) : (
      <p>{irvResult.message}</p>
    )
  ) : (
    <p>IRV result not available.</p>
  );

  return (
    <div>
      <h2>IRV Result</h2>
      {displayWinner}
    </div>
  );
}

export default PollResults;