/** @jsx React.DOM */
var converter = new Showdown.converter();
var Post = React.createClass({
    render: function () {
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
            <div className="post">
                <h2 className="postAuthor">
          {this.props.author}
                </h2>
                <h3 className="postTimeStamp">
                {this.props.timeStamp}
                </h3>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
            );
    }
});
var Posts = React.createClass({
    render: function () {
        var renderPost = function (post) {
            return <Post author={post.author} timeStamp={post.timeStamp}>{post}</Post>;
        };
        if (this) {
            var posts = this.props.posts.map(renderPost);
        }
        return (
            <div className="postList">
                {posts}
            </div>
            );
    }
});
var Blog = React.createClass({
    getInitialState: function () {
        var firebaseHandle = new Firebase(this.props.url);
        return {firebaseHandle: firebaseHandle, posts: []}
    },
    setPostsInState: function (posts) {
        var state = this.state;
        state.posts = [];
        for (var key in posts) {
            state.posts.push(posts[key]);
        }
        this.setState(state);
    },
    componentWillMount: function () {
        var state = this.state;
        var _this = this;
        state.firebaseHandle.on('value', function (postsSnapshot) {
            if (postsSnapshot.val() && postsSnapshot.val().posts) {
                _this.setPostsInState(postsSnapshot.val().posts);
            }
            else {
                state.firebaseHandle.set({posts: []}, function (error) {
                    if (error) {
                        console.log("Data not saved");
                    }
                    else {
                        console.log("Data saved");
                    }
                });
            }
        });
    },
    render: function () {
        return (<div className="posts">
            <Posts posts={this.state.posts} />
        </div>);
    }

});
React.renderComponent(
    <Blog url="https://notdecidedblog.firebaseio.com/"/>,
    document.getElementById('blog')
);
