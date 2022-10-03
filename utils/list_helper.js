const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce(
    (sum, curr) => sum + curr.likes,
    0,
);
const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
    const favorite = blogs.reduce(
        (prev, curr) => {
            if (prev.likes < curr.likes) prev = curr;
            return prev;
        },
        blogs[0],
    );
    return (({ title, author, likes }) => ({ title, author, likes }))(favorite);
};
const mostBlogs = (blogs) => {
    const result = _(blogs)
        .groupBy('author')
        .map(
            (blogsByAuthor, key) => ({
                author: key,
                blogs: blogsByAuthor.length,
            }),
        )
        .maxBy((item) => item.blogs);

    return result;
};
const mostLikes = (blogs) => {
    const result = _(blogs)
        .groupBy('author')
        .map(
            (blogsByAuthor, key) => ({
                author: key,
                likes: _(blogsByAuthor).sumBy((item) => item.likes),
            }),
        )
        .maxBy((item) => item.likes);
    return result;
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
