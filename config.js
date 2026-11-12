/* Edit these fields to change QR destinations. Leave quizUrl empty until the quiz is ready. */
window.LESSON_CONFIG = {
  // Use this server for QR links when opened over a LAN IP or a public domain.
  // A localhost/file URL cannot be reached from a phone, so keep the published fallback.
  vocabularyUrl: /^https?:$/.test(location.protocol) &&
    !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
    ? new URL('vocabulary.html', location.href).href
    : 'https://goltmannatalya2007-oss.github.io/cybersecurity/vocabulary.html',
  quizUrl: '',
  quizImage: '' // Optional relative path to a supplied QR image, e.g. assets/quiz-qr.png
};
