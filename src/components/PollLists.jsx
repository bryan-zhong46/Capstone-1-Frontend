import React, { useEffect, useState } from 'react';

const UserPolls = () => {
  const [publishedPolls, setPublishedPolls] = useState([]);
  const [draftPolls, setDraftPolls] = useState([]);
  const [participatedPolls, setParticipatedPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const [published, drafts, participated] = await Promise.all([
          fetch('/api/polls/published').then(res => res.json()),
          fetch('/api/polls/drafts').then(res => res.json()),
          fetch('/api/polls/participated').then(res => res.json()),
        ]);
        setPublishedPolls(published);
        setDraftPolls(drafts);
        setParticipatedPolls(participated);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) return <div>Loading polls...</div>;

  return (
    <div className="user-polls">
      <h2>Your Polls</h2>

      <PollSection title="Published Polls" polls={publishedPolls} />
      <PollSection title="Draft Polls" polls={draftPolls} />
      <PollSection title="Participated Polls" polls={participatedPolls} />
    </div>
  );
};

const PollSection = ({ title, polls }) => (
  <div className="poll-section">
    <h3>{title}</h3>
    {polls.length === 0 ? (
      <p>No {title.toLowerCase()}.</p>
    ) : (
      <ul>
        {polls.map(poll => (
          <li key={poll.id}>
            <strong>{poll.title}</strong> – {new Date(poll.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default UserPolls;
