// DOM SELECTION
const burgerMenu = document.querySelector('.burger-menu');
const burgerContent = document.querySelector('.burger-content');

const logo = document.querySelector('.logo');
const headerLinks = document.querySelector('.header-links');
const content = document.querySelector('#repo-content');
const HeaderInfo = document.querySelector('.info');
const badge = document.querySelector('.badge');
const searchResult = document.querySelector('.search-result');

logo.classList.add('inactive');
headerLinks.classList.add('inactive');
content.classList.add('inactive');
HeaderInfo.classList.add('inactive');
badge.classList.add('inactive');

// BURGERMENU EVENT

burgerMenu.addEventListener('click', () => {
    burgerContent.classList.toggle('content-active');
});


const form = document.forms['header-search'];
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = form.querySelector('#header-search input').value;

    // GRAPHQL API

    const data = JSON.stringify({
        query: `{
            user(login: "${value}") {
            name
            login
            bio
            avatarUrl
            repositories(first: 20) {
                nodes {
                name
                updatedAt
                stargazerCount
                forkCount
                primaryLanguage {
                    progName:name
                    color
                }
                    }
                }
            }
        }`
    });

    // 

    // API CALL

    async function init() {

        const response = await fetch(
            'https://api.github.com/graphql',
            {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    Authorization: `Bearer ${GITHUB_API}`
                },
            }
        );
        const json = await response.json();
        const user = json.data;

        // ADD ACTIVE
        logo.classList.add('active');
        headerLinks.classList.add('active');
        content.classList.add('active');
        HeaderInfo.classList.add('active');
        badge.classList.add('active');


        // DESTRUCTURING

        const { avatarUrl, name, login, bio, repositories } = user.user;
        const aside = document.querySelector('#repo-author');
        const repoContent = document.querySelector('div.client-repo');
        const headerImg = document.querySelector('.header-img');

        // DATA FROM API

        badge.textContent = `${repositories.nodes.length}`;
        searchResult.textContent = `${repositories.nodes.length} results for public repository`

        HeaderInfo.innerHTML = `
            <i class="far fa-bell"></i>
            <span class="hide">+</span><i class="hide fas fa-caret-down"></i>
            <img class="hide" src="${avatarUrl}" alt=""><i class="fas fa-caret-down hide"></i>

        `

        headerImg.innerHTML = `
            <div class="header-avatar">
                <a href="#"><img src="${avatarUrl}" alt=""> <p class="header-name">${login}</p></a>
            </div>
        `

        aside.innerHTML = `
            <div class="client-info">
                <div class="client-avatar">
                    <img src="${avatarUrl}" alt="avatar">
                </div>
                <div class="client-name">
                    <h2 class="login">${login}</h2>
                    <p>${name}</p>
                </div>
            </div>
            <div class="client-description">
                <p>${bio}</p>
            </div>
        `;

        repositories.nodes.forEach(({ name, forkCount, updatedAt, stargazerCount, primaryLanguage }) => {
            if (primaryLanguage === null) {
                return;
            } else {
                const { progName, color } = primaryLanguage;

                repoContent.innerHTML += `
                    <article class="card">
                        <div class="card-content">
                            <a href="#"><h3 class="repo-name">${name}</h3></a>
                            <button><i class="far fa-star"></i>Star</button>
                        </div>
                        <span class="color" style="background:${color}"></span>
                            <p class="lang">${progName}</p>
                            <p class="star"><i class="far fa-star"></i>${stargazerCount}</p>
                            <p class="branch"><i class="fas fa-code-branch"></i>${forkCount}</p>
                            <p class="date">${updatedAt.slice(3, 10)}</p>   
                    </article>
                `
            }
        });
    };
    init();
});

const input = document.querySelector('#header-search input');
input.addEventListener('keyup', () => {
    if (input.value === '') {
        location.reload();
    }
});