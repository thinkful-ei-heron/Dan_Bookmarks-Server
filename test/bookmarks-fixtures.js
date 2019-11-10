function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'Thinkful',
      url: 'https://www.thinkful.com',
      description: 'Think outside the classroom',
      rating: 5
    },
    {
      id: 2,
      title: 'Google',
      url: 'https://www.google.com',
      description: 'Where we find everything else',
      rating: 4
    },
    {
      id: 3,
      title: 'MDN',
      url: 'https://developer.mozilla.org',
      description: 'The only place to find web documentation',
      rating: 5
    }
  ];
}

function makeXssBookmarksArray() {
  const maliciousBookmarks = [
    {
      id: 1,
      title: 'Thinkful <script>alert("xss");</script>',
      url: 'https://www.thinkful.com',
      description:
        'Think outside the classroom <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
      rating: 5
    },
    {
      id: 2,
      title: 'Google <script>alert("xss");</script>',
      url: 'https://www.google.com',
      description:
        'Where we find everything else <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">',
      rating: 4
    }
  ];

  const expectedBookmarks = [
    {
      id: 1,
      title: 'Thinkful &lt;script&gt;alert("xss");&lt;/script&gt;',
      url: 'https://www.thinkful.com',
      description: 'Think outside the classroom <img src="https://url.to.file.which/does-not.exist">',
      rating: 5
    },
    {
      id: 2,
      title: 'Google &lt;script&gt;alert("xss");&lt;/script&gt;',
      url: 'https://www.google.com',
      description: 'Where we find everything else <img src="https://url.to.file.which/does-not.exist">',
      rating: 4
    }
  ];

  return { maliciousBookmarks, expectedBookmarks };
}
module.exports = { makeBookmarksArray, makeXssBookmarksArray };
