import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

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
        const irvResponse = await fetch(`/api/pollResults/${pollId}/irv-result`);
        if (!irvResponse.ok) {
          const errorData = await irvResponse.json();
          throw new Error(`HTTP error! status: ${irvResponse.status} - ${errorData.message || 'Error fetching IRV result'}`);
        }
        const irvResultData = await irvResponse.json();
        setIrvResult(irvResultData);

      } catch (err) {
        setError(err);
        setIrvResult({ winner: null, message: `Failed to load IRV results: ${err.message}`, rounds: [] });
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

  const prepareMultiRoundChartData = (rounds) => {
    if (!rounds || rounds.length === 0) return [];

    const allCandidates = new Set();
    rounds.forEach(round => {
      Object.keys(round.votes).forEach(candidate => allCandidates.add(candidate));
    });

    return rounds.map(round => {
      const roundChartData = {
        name: `Round ${round.round}` + (round.eliminated ? ` (Elim: ${round.eliminated})` : '') + (round.winnerFound ? ' (Winner!)' : ''),
        totalVotes: round.totalActiveBallots
      };
      allCandidates.forEach(candidate => {
        roundChartData[candidate] = round.votes[candidate] || 0;
      });
      return roundChartData;
    });
  };

  const chartData = prepareMultiRoundChartData(irvResult.rounds);
  const allCandidateNames = chartData.length > 0 ? Object.keys(chartData[0]).filter(key => key !== 'name' && key !== 'totalVotes') : [];

  const displayWinner = irvResult ? (
    irvResult.winner ? (
      <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'green' }}>🎉 Winner: {irvResult.winner} 🎉</p>
    ) : (
      <p style={{ fontSize: '1.2em', fontStyle: 'italic' }}>{irvResult.message}</p>
    )
  ) : (
    <p>IRV result not available.</p>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>IRV Result</h2>
      {displayWinner}

      {irvResult.rounds && irvResult.rounds.length > 0 ? (
        <>
          <h3>Vote Distribution Per Round</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {allCandidateNames.map(candidate => (
                <Bar key={candidate} dataKey={candidate} stackId="a" fill={
                    (() => {
                        const colors = ['#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1'];
                        const index = allCandidateNames.indexOf(candidate);
                        return colors[index % colors.length];
                    })()
                } />
              ))}
            </BarChart>
          </ResponsiveContainer>

          <h3 style={{ marginTop: '40px' }}>Round Details</h3>
          {irvResult.rounds.map((round, index) => (
            <div key={index} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
              <h4>Round {round.round} {round.winnerFound && '(Winner Found)'}</h4>
              <p><strong>Status:</strong> {round.message}</p>
              <p><strong>Total Active Ballots:</strong> {round.totalActiveBallots}</p>
              {round.eliminated && <p style={{ color: 'red' }}><strong>Eliminated:</strong> {round.eliminated}</p>}
              <p><strong>Vote Counts:</strong></p>
              <ul>
                {Object.entries(round.votes).map(([candidate, votes]) => (
                  <li key={candidate}>{candidate}: {votes} votes</li>
                ))}
              </ul>
            </div>
          ))}
        </>
      ) : (
        <p>No round-by-round data available.</p>
      )}
    </div>
  );
}

export default PollResults;