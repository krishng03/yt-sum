from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk

app = Flask(__name__)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

@app.route('/transcript', methods=['GET'])
def get_transcript():
    """
    Fetch transcript for a YouTube video ID
    Query parameter: video_id
    Returns: JSON with 'transcript' field containing the full transcript text or empty string
    """
    video_id = request.args.get('video_id')
    
    if not video_id:
        return jsonify({
            'error': 'video_id parameter is required',
            'transcript': ''
        }), 400
    
    try:
        # Use the new API method for version 1.1.0+
        ytt_api = YouTubeTranscriptApi()
        fetched_transcript = ytt_api.fetch(video_id)
        fetched_transcript = fetched_transcript.to_raw_data()
        full_text = ' '.join(snippet['text'] for snippet in fetched_transcript)
        
        # NLP Processing
        tokens = word_tokenize(full_text.lower())
        tokens = [word for word in tokens if word.isalnum()]
        tokens = [word for word in tokens if word not in stopwords.words('english')]
        
        cleaned_text = ' '.join(tokens)

        return jsonify({
            'video_id': video_id,
            'transcript': full_text,
            'cleaned_transcript': cleaned_text
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'transcript': '',
            'video_id': video_id
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'YouTube Transcript API Server is running'})

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with usage instructions"""
    return jsonify({
        'message': 'YouTube Transcript API Server',
        'usage': 'GET /transcript?video_id=YOUR_VIDEO_ID',
        'example': '/transcript?video_id=dQw4w9WgXcQ',
        'health_check': '/health'
    })

if __name__ == '__main__':
    port = 5000
    app.run(host='0.0.0.0', port=port, debug=True)
