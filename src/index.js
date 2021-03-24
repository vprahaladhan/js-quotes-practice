const url = 'http://localhost:3000'

fetch(`${url}/quotes`)
  .then(res => res.json())
  .then(quotes => {
    quotes.forEach(quote => {
      fetch(`${url}/likes/?quoteId=${quote.id}`)
        .then(res => res.json())
        .then(likesForQuote => {
          const quoteList = document.getElementById('quote-list');
          const quoteContainer = document.createElement('div');
          quoteContainer.setAttribute('id', quote.id);

          const quoteText = document.createElement('p');
          quoteText.innerHTML = `<h5>${quote.quote}</h5>`;
          
          const quoteAuthor = document.createElement('p');
          quoteAuthor.innerHTML = quote.author;
    
          const likes = document.createElement('p');
          likes.setAttribute('id', `likes-${quote.id}`);
          likes.innerHTML = `Likes: ${likesForQuote.length}`;

          const likeBtn = document.createElement('button');
          likeBtn.innerHTML = 'Like';

          const deleteBtn = document.createElement('button');
          deleteBtn.innerHTML = 'Delete';
    
          quoteContainer.appendChild(document.createElement('hr'));
          quoteContainer.appendChild(quoteText);
          quoteContainer.appendChild(quoteAuthor);          
          quoteContainer.appendChild(likes);
          quoteContainer.appendChild(likeBtn);
          quoteContainer.appendChild(deleteBtn);
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
                fetch(`${url}/quotes/${quote.id}/?_embed=likes`)
                  .then(res => res.json())
                  .then(quote => {
                    document.getElementById(`likes-${quote.id}`).innerHTML = `Likes: ${quote.likes.length}`;
                  });
              });
          });
        });
    });
  })