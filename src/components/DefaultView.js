import React, { Component } from 'react';
import { Menu, Button, Feed, Icon, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  fetchPosts,
  sortByDate,
  sortByPopularity,
  incrementLikes,
  decrementLikes
} from '../actions';

class DefaultView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 'All',
      activeSort: 'mostPopular'
    };
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
    this.sortBy = this.sortBy.bind(this);
  }

  componentDidMount() {
    this.props.fetchPosts();
  }

  handleCategoryClick = (e, { name }) => {
    this.setState({ activeCategory: name });
  };

  handleSortClick = (e, { name }) => {
    this.setState({ activeSort: name });
    //todo: which method if better/more efficient
    // name === 'mostPopular'
    //   ? this.props.sortByPopularity(this.props.posts)
    //   : this.props.sortByDate(this.props.posts);
    name === 'mostPopular'
      ? _.reverse(_.sortBy(this.props.post, 'voteScore'))
      : _.reverse(_.sortBy(this.props.post, 'timestamp'));
  };

  sortBy = posts => {
    return this.state.activeSort === 'mostPopular'
      ? _.reverse(_.sortBy(posts, 'voteScore'))
      : _.reverse(_.sortBy(posts, 'timestamp'));
  };

  renderPosts = category => {
    if (!_.isEmpty(this.props.posts)) {
      let posts =
        category !== 'All'
          ? this.sortBy(
              _.filter(this.props.posts, post => post.category === category)
            )
          : this.sortBy(this.props.posts);
      return _.map(posts, post =>
        <Feed.Event key={post.id}>
          <Feed.Label>
            <Icon bordered name="user" />
          </Feed.Label>
          <Feed.Content>
            <Feed.Summary>
              <Feed.User>{post.author}</Feed.User> in <a>{post.category}</a>
              <Feed.Date>{moment(post.timestamp).fromNow()}</Feed.Date>
            </Feed.Summary>
            <Feed.Extra text>
              {post.body}
            </Feed.Extra>
            <Feed.Meta>
              <Feed.Like
                onClick={this.props.incrementLikes.bind(null, post.id)}
              >
                <Icon name="thumbs up" />
              </Feed.Like>
              <Feed.Like
                onClick={this.props.decrementLikes.bind(null, post.id)}
              >
                <Icon name="thumbs down" />
              </Feed.Like>
              <Feed.Like>
                {post.voteScore}
              </Feed.Like>
            </Feed.Meta>
          </Feed.Content>
        </Feed.Event>
      );
    }
  };

  renderCategories = activeCategory => {
    if (!_.isEmpty(this.props.categories)) {
      return this.props.categories.map(category =>
        <Menu.Item
          name={category}
          active={activeCategory === category}
          onClick={this.handleCategoryClick}
          key={category}
        />
      );
    }
  };

  render() {
    const { activeCategory, activeSort } = this.state;
    const { posts } = this.props;

    if (!posts) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Menu tabular inverted>
          <Menu.Item header>Readable</Menu.Item>
          <Menu.Item
            name="All"
            active={activeCategory === 'All'}
            onClick={this.handleCategoryClick}
          />
          {this.renderCategories(activeCategory)}
          <Menu.Menu position="right">
            <Menu.Item>
              <Link to="/create">
                <Button primary floated="right">
                  Create Post
                </Button>
              </Link>
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Grid>
          <Grid.Column stretched width={12}>
            <Feed>
              {this.renderPosts(this.state.activeCategory)}
            </Feed>
          </Grid.Column>

          <Grid.Column width={4}>
            <Menu text vertical>
              <Menu.Item header>Sort By</Menu.Item>
              <Menu.Item
                name="mostPopular"
                active={activeSort === 'mostPopular'}
                onClick={this.handleSortClick}
              />
              <Menu.Item
                name="MostRecent"
                active={activeSort === 'mostRecent'}
                onClick={this.handleSortClick}
              />
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ posts, categories }) => {
  return {
    posts,
    categories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPosts: () => dispatch(fetchPosts()),
    sortByDate: posts => dispatch(sortByDate(posts)),
    sortByPopularity: posts => dispatch(sortByPopularity(posts)),
    incrementLikes: id => dispatch(incrementLikes(id)),
    decrementLikes: id => dispatch(decrementLikes(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultView);
