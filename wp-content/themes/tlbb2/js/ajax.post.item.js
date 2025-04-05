document.addEventListener('DOMContentLoaded', function () {
    if (typeof image_url !== 'undefined') {
        // Function to fetch and display posts by category
        const fetchAndDisplayPosts = (categorySlug, page = 1) => {
            const itemsPerPageElement = document.getElementById('itemPerPage');
            const itemsPerPage = itemsPerPageElement ? parseInt(itemsPerPageElement.value) : 5;

            fetch(`/wp-admin/admin-ajax.php?action=get_news_posts&category=${categorySlug}&page=${page}&itemsPerPage=${itemsPerPage}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    const postsContainer = document.getElementById('posts-container');
                    const paginationContainer = document.querySelector('.pagination');
                    if (!postsContainer) {
                        console.error('Element with id "posts-container" not found');
                        return;
                    }

                    postsContainer.innerHTML = '';

                    if (data.posts.length > 0) {
                        data.posts.forEach(post => {
                            const postDate = new Date(post.published_at);
                            const formattedDate = postDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

                            const hotNewsImage = post.hot_news == 1 ? `
                                <img src="${image_url}/btn-hot.webp" alt=""/>
                            ` : '';

                            const postElement = document.createElement('li');
                            postElement.innerHTML = `
                                <div class="news_item ${post.hot_news == 1 ? 'isHot' : ''}">
                                    <div class="flex">
                                        <a href="${post.link}" title="${post.title}" class="news_item__thumbnail">
                                            <img class="lazyload" src="${post.image}" alt="${post.title}"/>
                                        </a>
                                        <div class="content__right flex flex-column flex-between">
                                            <a href="${post.link}" title="${post.title}" class="news_item__title flex flex-middle">
                                                ${hotNewsImage}
                                                <span>${post.title}</span>
                                            </a>
                                            <p class="shortContent">${post.excerpt}</p>
                                            <div class="content__bottom">
                                                <p>${formattedDate}</p>
                                                <a href="${post.link}" title="${post.title}" class="news_item__viewdetail">
                                                    <img src="${image_url}/btn-readall.webp" alt="Read All"/>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            postsContainer.appendChild(postElement);
                        });

                        // Update pagination
                        const totalPages = Math.ceil(data.total_pages);
                        paginationContainer.innerHTML = '';

                        // Add Prev button
                        const prevItem = document.createElement('li');
                        prevItem.classList.add('prev', 'page-item');
                        if (page === 1) {
                            prevItem.classList.add('disabled');
                        }
                        prevItem.innerHTML = `<a href="#" class="page-link" data-page="${page - 1}">‹</a>`;
                        paginationContainer.appendChild(prevItem);

                        // Add page numbers
                        for (let i = 1; i <= totalPages; i++) {
                            const pageItem = document.createElement('li');
                            pageItem.classList.add('page-item');
                            if (i === page) {
                                pageItem.classList.add('active');
                            }
                            pageItem.innerHTML = `<a href="#" class="page-link" data-page="${i}">${i}</a>`;
                            paginationContainer.appendChild(pageItem);
                        }

                        // Add Next button
                        const nextItem = document.createElement('li');
                        nextItem.classList.add('next', 'page-item');
                        if (page === totalPages) {
                            nextItem.classList.add('disabled');
                        }
                        nextItem.innerHTML = `<a href="#" class="page-link" data-page="${page + 1}">›</a>`;
                        paginationContainer.appendChild(nextItem);

                        // Add event listeners for pagination links
                        const paginationLinks = document.querySelectorAll('.page-link');
                        paginationLinks.forEach(link => {
                            link.addEventListener('click', function(event) {
                                event.preventDefault();
                                const page = parseInt(this.getAttribute('data-page'));
                                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                                    fetchAndDisplayPosts(categorySlug, page);
                                }
                            });
                        });
                    } else {
                        postsContainer.innerHTML = '<p class="text-danger">Chưa có bài viết nào trong danh mục.</p>';
                        paginationContainer.innerHTML = '';
                    }
                })
                .catch(error => console.error('Error:', error));
        };

        // Function to get category slug from data-category attribute
        const getCategorySlugFromDataAttribute = () => {
            const bodyElement = document.querySelector('body');
            return bodyElement ? bodyElement.getAttribute('data-category') : null;
        };

        // Fetch and display posts for the category from data-category attribute on page load
        const categorySlug = getCategorySlugFromDataAttribute();
        if (categorySlug) {
            fetchAndDisplayPosts(categorySlug);

            // Set active tab for the current category
            const links = document.querySelectorAll('.post_item_list');
            links.forEach(link => {
                if (link.getAttribute('data-params') === categorySlug) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        // Event listeners for category links
        const links = document.querySelectorAll('.post_item_list');
        links.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                
                // Xóa lớp 'active' khỏi tất cả các liên kết
                links.forEach(link => link.classList.remove('active'));
                // Thêm lớp 'active' cho liên kết được nhấp
                this.classList.add('active');
                
                const categorySlug = this.getAttribute('data-params');
                fetchAndDisplayPosts(categorySlug);
            });
        });
    } else {
        console.error('image_url variable is not defined');
    }
});

function truncateWords(str, numWords) {
    let words = str.split(' ');
    if (words.length > numWords) {
        return words.slice(0, numWords).join(' ') + '...';
    }
    return str;
}
