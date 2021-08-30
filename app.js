const express = require("express");
const morgan = require("morgan");
const PORT = 1337;
const posts = require("./postBank");

const app = express();
app.use(morgan('dev'));
app.use(express.static('public'));

app.get("/test", (req, res) => res.send("Hello World!"));

app.get("/", (req, res) => {
    const postList = posts.list();
    const outputList = postList.map(post => `<p>
                                                <span class="news-position">
                                                    ${post.id}. 
                                                    <a href="/posts/${post.id}">${post.title}</a>
                                                    <br>
                                                    <small>By: ${post.name}</small>
                                                </span>
                                            </p>
                                            <small class="news-info">
                                                ${post.upvotes} upvotes | ${post.date}
                                            </small>`
    );

    const output =`<!DOCTYPE html>
        <html>
            <head>
                <title>Wizard-News</title>
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
                <header><img src="/logo.png"/>Wizard News</header>
                <div class="news-list">Headlines
                    <div class="news-item">
                        ${outputList.join('')}
                    </div>
                </div>
            </body>
        </html>`

    res.send(output);
})

app.get( "/posts/:id", (req, res) => {
    const id = req.params.id;
    const post = posts.find(id);

    if (!post.id) {
        throw new Error('Not Found')
    }

    const output =`<!DOCTYPE html>
    <html>
        <head>
            <title>Wizard-News</title>
            <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
            <header><img src="/logo.png"/><a class="news" href="/">Wizard News</a></header>
            <div class="news-item">
                <p>
                    <span>
                        ${post.title} 
                        <br>
                        <small>By: ${post.name} | ${post.date}</small>
                    </span>
                </p>
                <div class="news-info">${post.content}</div>
            </div>
        </body>
    </html>`

    res.send(output);
})

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(404);
    const html = `<!DOCTYPE html>
        <html>
            <head>
                <title>Wizard News</title>
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
            <header><img src="/logo.png"/><a class="news" href="/">Wizard News</a></header>
                <div class="not-found">
                    <p>404</p>
                    <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
                </div>
            </body>
        </html>`
    res.send(html);
})

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
