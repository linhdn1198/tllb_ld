document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.category_item');
    const viewAllLink = document.querySelector('.viewAll');

    // Hàm fetch và hiển thị các bài viết
    const fetchAndDisplayPosts = (params, categoryLink) => {
        fetch(`${my_ajax_object.ajax_url}?action=get_posts_by_category&category=${params}&nonce=${my_ajax_object.nonce}`)
            .then(response => response.json())
            .then(data => {
                const postsContainer = document.getElementById('posts-container');
                postsContainer.innerHTML = '';

                if (data.status === 'success' && data.data.length > 0) {
                    data.data.forEach(post => {
                        const postDate = new Date(post.published_at);
                        const formattedDate = postDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

                        const hotNewsImage = post.hot_news == 1 ? `
                            <img class="hot--news ls-is-cached lazyloaded" data-src="${image_url}/btn-hot.webp" alt="${post.title}" src="${image_url}/btn-hot.webp">
                        ` : '';

                        const truncatedTitle = truncateTitle(post.title, 50); // Giới hạn ký tự

                        const postElement = document.createElement('li');
                        postElement.innerHTML = `
                            <a href="${post.link}" class="news_item__title" title="${post.title}">
                                ${hotNewsImage}
                                ${truncatedTitle}
                                <span class="news_item__time">${formattedDate}</span>
                            </a>
                        `;
                        postsContainer.appendChild(postElement);
                    });
                } else {
                    postsContainer.innerHTML = '<p class="text-danger">Chưa có bài viết nào trong danh mục.</p>';
                }

                // Cập nhật liên kết "Xem tất cả"
                viewAllLink.setAttribute('href', categoryLink);
            })
            .catch(error => console.error('Error:', error));
    };

    // Fetch và hiển thị các bài viết cho danh mục đầu tiên khi tải trang
    if (links.length > 0) {
        const firstLink = links[0];
        const params = firstLink.getAttribute('data-params');
        const categoryLink = firstLink.getAttribute('data-category-link');
        fetchAndDisplayPosts(params, categoryLink);
    }

    // Thêm sự kiện lắng nghe cho các liên kết danh mục
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            
            // Xóa lớp 'active' khỏi tất cả các liên kết
            links.forEach(link => link.classList.remove('active'));
            // Thêm lớp 'active' cho liên kết được nhấp
            this.classList.add('active');
            
            const params = this.getAttribute('data-params');
            const categoryLink = this.getAttribute('data-category-link');
            fetchAndDisplayPosts(params, categoryLink);
        });
    });
});

// Hàm truncateTitle để rút gọn tiêu đề theo ký tự
function truncateTitle(title, charLimit) {
    if (title.length > charLimit) {
        return title.substr(0, title.lastIndexOf(' ', charLimit)) + ' ...';
    }
    return title;
}
