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
      storedUserId = crypto.randomUUID();
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
   console.log('Trying to vote on meme:', memeId, 'as user:', userId);
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
<div className="voting-app">
	  <header className="nav-header">
  <nav className="nav-bar">
    <a href="https://luna-meme-generator.vercel.app/">🖼️ Generator</a>
    <a href="https://luna-meme-voting.vercel.app/">🗳️ Voting</a>
    <a href="https://luna-meme-leaderboard.vercel.app/">📊 Leaderboard</a>
  </nav>
</header>

  <h1 className="title">🏆 Vote for Your Favorite Meme!</h1>
  <div className="meme-grid">
    {memes.map((meme) => (
      <div className="meme-card" key={meme.id}>
        <img src={meme.image_url} alt={meme.text} />
        <p className="meme-text">{meme.text}</p>
        <p className="vote-count">🔥 Votes: {meme.upVote}</p>
        <button
          onClick={() => handleVote(meme.id)}
          disabled={userVotes.includes(meme.id)}
          className="vote-button"
        >
          {userVotes.includes(meme.id) ? '✅ Voted' : 'Vote'}
        </button>
      </div>
    ))}
  </div>
</div>
  );
}

export default App;
