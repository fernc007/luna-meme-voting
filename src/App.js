import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

function App() {
  const [memes, setMemes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userVotes, setUserVotes] = useState([]);

  // 1. Generate anonymous user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem('meme_user_id');
    if (!storedUserId) {
      storedUserId = `user_${crypto.randomUUID()}`;
      localStorage.setItem('meme_user_id', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  // 2. Load memes + user votes
  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      const { data: memesData } = await supabase
        .from('memes')
        .select('*')
        .order('upVote', { ascending: false });

      console.log('Memes loaded:', memesData);

	const { data: votesData } = await supabase
        .from('votes')
        .select('meme_id')
        .eq('user_id', userId);

      setMemes(memesData || []);
      setUserVotes(votesData?.map((v) => v.meme_id) || []);
    };

    loadData();
  }, [userId]);

  // 3. Handle vote
  const handleVote = async (memeId) => {
	  // console.log("voting on meme with id:", memeId);
    if (userVotes.includes(memeId)) return; // already voted

    // Insert vote
    const { error: insertError } = await supabase
    .from('votes')
    .insert([{ meme_id: memeId, user_id: userId }]);

    if (insertError) {
    if (insertError.code === '23505') {
      console.warn('User already voted for this meme.');
    } else {
      console.error('Error inserting vote:', insertError.message);
    }
    return;
  }

    // Increment upVote count
  
     const { error: rpcError } = await supabase
    .rpc('increment_upvote', { meme_id_input: memeId });

    if (rpcError) {
    console.error('Error incrementing upVote:', rpcError.message);
    return;
  }

    // Optimistic UI update
    setMemes((prev) =>
      prev.map((meme) =>
        meme.id === memeId ? { ...meme, upVote: meme.upVote + 1 } : meme
      )
    );

    setUserVotes([...userVotes, memeId]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Vote for Your Favorite Meme!</h1>
      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {memes.map((meme) => (
          <div
            key={meme.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '10px',
              background: '#fff',
              textAlign: 'center',
            }}
          >
            <img
              src={meme.image_url}
              alt={meme.text}
              style={{ maxWidth: '100%', borderRadius: '6px' }}
            />
            <p style={{ fontWeight: 'bold' }}>{meme.text}</p>
            <p>Votes: {meme.upVote}</p>
            <button
              onClick={() => handleVote(meme.id)}
              disabled={userVotes.includes(meme.id)}
            >
              {userVotes.includes(meme.id) ? 'Voted' : 'Vote'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
