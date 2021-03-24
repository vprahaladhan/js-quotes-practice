const url = 'http://localhost:3000'

const fetchQuotesWithLikes = () => {
  fetch(`${url}/quotes?_embed=likes`)
    .then(res => res.json())
    .then(quotes => {
      quotes.forEach(quote => {
        const quoteList = document.getElementById('quote-list');
        const quoteContainer = document.createElement('div');
        quoteContainer.setAttribute('id', quote.id);

        const quoteText = document.createElement('p');
        quoteText.innerHTML = `<h5>${quote.quote}</h5>`;

        const quoteAuthor = document.createElement('p');
        quoteAuthor.innerHTML = quote.author;

        const likes = document.createElement('p');
        likes.setAttribute('id', `likes-${quote.id}`);
        likes.innerHTML = `Likes: ${quote.likes.length}`;

        const likeBtn = document.createElement('button');
        likeBtn.innerHTML = 'Like';

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = 'Delete';

        const editBtn = document.createElement('button');
        editBtn.innerHTML = 'Edit';

        quoteContainer.appendChild(document.createElement('hr'));
        quoteContainer.appendChild(quoteText);
        quoteContainer.appendChild(quoteAuthor);
        quoteContainer.appendChild(likes);
        quoteContainer.appendChild(likeBtn);
        quoteContainer.appendChild(deleteBtn);
        quoteContainer.appendChild(editBtn);
        quoteList.appendChild(quoteContainer);

        deleteBtn.addEventListener('click', () => {
          fetch(`${url}/quotes/${quote.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }).then(res => res.json())
            .then(() => {
              document.getElementById(quote.id).remove();
            })
        });

        likeBtn.addEventListener('click', () => {
          fetch(`${url}/likes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              quoteId: quote.id,
              createdAt: Math.round((new Date()).getTime() / 1000)
            })
          }).then(res => res.json())
            .then(() => {
              fetch(`${url}/quotes/${quote.id}?_embed=likes`)
                .then(res => res.json())
                .then(quote => {
                  document.getElementById(`likes-${quote.id}`).innerHTML = `Likes: ${quote.likes.length}`;
                });
            });
        });

        editBtn.addEventListener('click', () => {
          if (document.getElementById('edit-quote-form')) {
            document.getElementById('edit-quote-form').remove();
          } 
          else {
            const editContainer = document.createElement('div');
            const editForm = `
                <form id="edit-quote-form">
                  <div class="form-group">
                    <label for="edit-quote-${quote.id}">Edit Quote</label>
                    <input name="quote" type="text" class="form-control" id="edit-quote" value="${quote.quote}">
                  </div>
                  <div class="form-group">
                    <label for="Author">Edit Author</label>
                    <input name="author" type="text" class="form-control" id="edit-author" value="${quote.author}">
                  </div>
                  <button type="submit" class="btn btn-primary">Save</button>
                </form>
              `;
            editContainer.innerHTML = editForm;
            document.getElementById(quote.id).appendChild(editContainer);

            document.getElementById('edit-quote-form').addEventListener('submit', event => {
              event.preventDefault();

              fetch(`${url}/quotes/${quote.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  quote: document.getElementById('edit-quote').value,
                  author: document.getElementById('edit-author').value
                })
              }).then(res => res.json())
                .then(quote => {
                  console.log('Edited quote >> ', quote);
                  document.getElementById('edit-quote-form').remove();
                  quoteText.innerHTML = `<h5>${quote.quote}</h5>`;
                  quoteAuthor.innerHTML = quote.author;
                });
            });
          };
        });
      });
  });
};

fetchQuotesWithLikes();

document.getElementById('new-quote-form').addEventListener('submit', event => {
  event.preventDefault();

  fetch(`${url}/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: document.getElementById('new-quote').value,
      author: document.getElementById('author').value
    })
  }).then(response => response.json())
    .then(() => {
      document.getElementById('quote-list').innerHTML = '';
      fetchQuotesWithLikes();
      document.getElementById('new-quote').value = '';
      document.getElementById('author').value = '';
    });
});