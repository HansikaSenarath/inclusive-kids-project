-- Demo learning content so the app is usable right after setup.
INSERT INTO content_items (title, description, type, age_min, age_max, category, content, icon)
VALUES
  (
    'The Brave Little Turtle',
    'A gentle story about courage and kindness.',
    'story',
    4,
    9,
    'literacy',
    '{"pages": [
      {"text": "Once there was a little turtle who was afraid of the big race.", "image": "turtle"},
      {"text": "But the turtle took a deep breath and decided to be brave.", "image": "turtle-brave"},
      {"text": "Along the way, the turtle met a rabbit who was stuck in the mud.", "image": "turtle-rabbit"},
      {"text": "The turtle stopped to help, even though it meant losing the race.", "image": "rabbit-thank"},
      {"text": "In the end, the turtle learned that kindness matters more than winning.", "image": "turtle-smile"}
    ]}'::jsonb,
    'book-open'
  ),
  (
    'Explore the Solar System',
    'Test what you know about the planets.',
    'quiz',
    6,
    12,
    'science',
    '{"questions": [
      {"question": "Which planet is known as the Red Planet?", "options": ["Mars", "Jupiter", "Saturn", "Venus"], "answer": 0, "emoji": "mars"},
      {"question": "Which is the largest planet in our solar system?", "options": ["Saturn", "Jupiter", "Venus", "Mars"], "answer": 1, "emoji": "jupiter"},
      {"question": "Which planet has beautiful rings around it?", "options": ["Venus", "Mars", "Saturn", "Jupiter"], "answer": 2, "emoji": "saturn"},
      {"question": "Which planet is closest in size to Earth?", "options": ["Venus", "Saturn", "Jupiter", "Mars"], "answer": 0, "emoji": "venus"}
    ]}'::jsonb,
    'rocket'
  ),
  (
    'Maya''s Big Idea',
    'A story about believing in your dreams.',
    'story',
    5,
    11,
    'social',
    '{"pages": [
      {"text": "Maya loved to dream up new inventions every night.", "image": "maya"},
      {"text": "One day she imagined a lamp that could light up the whole village.", "image": "dream"},
      {"text": "She worked hard, gathering old parts to build her lamp.", "image": "lamp"},
      {"text": "When it finally lit up, the whole village came to see.", "image": "village"},
      {"text": "Maya learned that big ideas can start with just one small light.", "image": "maya-success"}
    ]}'::jsonb,
    'lightbulb'
  ),
  (
    'Counting with Apples',
    'A fun quiz about numbers and counting.',
    'quiz',
    4,
    8,
    'numeracy',
    '{"questions": [
      {"question": "How many apples make a pair?", "options": ["1", "2", "3", "4"], "answer": 1, "emoji": "apple"},
      {"question": "What comes after the number 4?", "options": ["3", "6", "5", "7"], "answer": 2, "emoji": "apple"},
      {"question": "If you have 2 apples and get 2 more, how many do you have?", "options": ["2", "3", "4", "5"], "answer": 2, "emoji": "apple"}
    ]}'::jsonb,
    'calculator'
  )
ON CONFLICT DO NOTHING;
