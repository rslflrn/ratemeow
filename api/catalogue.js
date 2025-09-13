<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catalogue - RateMeow</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #fafafa;
      color: #333;
      text-align: center;
      padding: 40px;
    }
    h1 {
      margin-bottom: 30px;
    }
    #catalogue {
      text-align: left;
      max-width: 600px;
      margin: 0 auto;
      font-size: 18px;
      line-height: 1.8;
      white-space: pre-line;
    }
    .home-btn {
      display: inline-block;
      margin-top: 30px;
      padding: 10px 20px;
      background-color: #333;
      color: white;
      text-decoration: none;
      border-radius: 6px;
    }
    .home-btn:hover {
      background-color: #555;
    }
  </style>
</head>
<body>
  <h1>📚 Catalogue</h1>
  <div id="catalogue">Loading catalogue...</div>
  <a class="home-btn" href="index.html">🏠 Home</a>

  <script>
    async function loadCatalogue() {
      try {
        const res = await fetch('/api/catalogue');
        const data = await res.json();

        if (!data.data) {
          document.getElementById('catalogue').innerText = "No catalogue data found.";
          return;
        }

        // Header row is skipped (your API already starts from A2:E)
        const books = data.data.filter(row => row[4] && row[4].toLowerCase() === 'available');

        if (books.length === 0) {
          document.getElementById('catalogue').innerText = "All books are sold out.";
          return;
        }

        const list = books.map(row => {
          const [title, author, code, price] = row;
          return `${title} | ${author} | ${code.toUpperCase()} | ${price}`;
        }).join("\n\n");

        document.getElementById('catalogue').innerText = list;
      } catch (err) {
        document.getElementById('catalogue').innerText = "Failed to load catalogue.";
        console.error("Error fetching catalogue:", err);
      }
    }

    loadCatalogue();
  </script>
</body>
</html>
