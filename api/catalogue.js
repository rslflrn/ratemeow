async function loadCatalogue() {
  try {
    const res = await fetch("/api/catalogue");
    const books = await res.json();

    const container = document.getElementById("catalogue-container");
    container.innerHTML = "";

    books.forEach(book => {
      const card = document.createElement("div");
      card.className = "book-card";

      card.innerHTML = `
        <h2>${book.title}</h2>
        <p>✍️ ${book.author}</p>
        <p>💲 ${book.price}</p>
        <p>📦 ${book.status}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load catalogue:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadCatalogue);
