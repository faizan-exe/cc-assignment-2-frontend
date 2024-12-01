import { useState } from 'react';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    try {
      const response = await fetch('https://api-gw-prod-4dtc3pwo.uc.gateway.dev/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: searchQuery }),
      });

      const data = await response.json();
      console.log('Response data:', data);

      // Assuming the response data contains a URL to the generated image
      if (data && data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        console.error('Image URL not found in the response.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false once the request completes
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Five Gens</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Enter your search query"
          style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
        />
        <br />
        <button type="submit" style={{ padding: '10px 20px' }}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {/* Display the generated image if it exists */}
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', border: '1px solid #ddd', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
}

export default App;
